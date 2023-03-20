import { useState, useEffect } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { BaseMap } from "@/components/map/baseMap";
import { NoteMarker } from "@/components/map/noteMarker";
import { Menu } from "@/components/menu/menu";
import { MapStyleMenu } from "@/components/menu/mapStyleMenu";
import { CreateNoteModal } from "@/components/modals/createNote";
import { ReadNoteModal } from "@/components/modals/readNote";
import { useNoteStore } from "@/services/stores/noteStore";
import { useConnectionStore } from "@/services/stores/connectionStore";
import { useNoteReadStore } from "@/services/stores/noteReadStore";
import { Note, NoteRead } from "@/services/types/note";
import { LatLng } from "@/services/types/latlng";
import { getFullNote, getNotes } from "@/services/database/notes/getNotes";
import { getNoteReads } from "@/services/database/noteReads/getNoteReads";
import { updateNoteRead } from "@/services/database/noteReads/updateNoteRead";
import { getUserConnections } from "@/services/users/getUserConnections";
import { haversine } from "@/services/geo/haversine";
import { TooFarAlert, DistanceToNoteUnit } from "@/components/modals/tooFar";
import { ZoomInAlert } from "@/components/modals/zoomInAlert";
import { MapStyle } from "@/services/types/mapObjects";
import { addNoteRead } from "@/services/database/noteReads/addNoteRead";

const proximityRadius = 5; //0.2; // 0.2km

export default function Home() {
    const { user } = useUser();
    const [userLatLng, setUserLatLng] = useState<LatLng>({
        lat: 51.4769,
        lng: 0
    });
    const [selectedPoint, setSelectedPoint] = useState<{
        lat: number;
        lng: number;
    }>({ lat: 0, lng: 0 });
    const [noteCreateModalOpen, setNoteCreateModalOpen] = useState(false);
    const [noteReadModalOpen, setNoteReadModalOpen] = useState(false);
    const [blockRead, setBlockRead] = useState(false);
    const [zoomAlert, setZoomAlert] = useState(false);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [distanceToNote, setDistanceToNote] = useState<number>(0);
    const [currentZoom, setCurrentZoom] = useState<number>(0);
    const [mapStyle, setMapStyle] = useState<MapStyle>(MapStyle.LIGHT);
    const [menuSelected, setMenuSelected] = useState<string | null>(null);
    const { notes, setNotesInStore, updateNoteInStore } = useNoteStore();
    const [notesLoading, setNotesLoading] = useState<boolean>(true);
    const [noteReadsLoading, setNoteReadsLoading] = useState<boolean>(true);

    const {
        noteReads,
        setNoteReadsInStore,
        addNoteReadToStore,
        updateNoteReadInStore
    } = useNoteReadStore();
    const { setConnectionsInStore } = useConnectionStore();

    // Filter notes to only show those where user_id matches user.id or to_user_id matches user.id
    const updateVisibleNotes = (notes: Note[]) => {
        const visibleNotes = notes.map((note: Note) => {
            // Check if note_uuid has been read by user and starred
            const noteRead = noteReads.find(
                (noteRead: NoteRead) => noteRead?.note_id === note.uuid
            );
            if (note.user_id === user?.id) {
                return { ...note, read: true, starred: false };
            }
            if (noteRead) {
                return {
                    ...note,
                    read: true,
                    last_read: noteRead.last_read,
                    starred: noteRead.starred ? true : false
                };
            }
            return { ...note, content: "", read: false, starred: false };
        });
        return visibleNotes;
    };

    // Handles selection of a point on the map, with various outcomes depending on the zoom level
    const handleSelectedPoint = (point: { lat: number; lng: number }) => {
        if (!blockRead && currentZoom > 13) {
            setSelectedPoint(point);
            setNoteCreateModalOpen(true);
        } else {
            if (!blockRead && currentZoom < 13) {
                setSelectedPoint(point);
                setZoomAlert(true);
            }
        }
    };

    // Handle click on a note, with various outcomes depending on the note's read status
    const handleNoteClick = async (
        note: Note,
        noteDistanceFromUser: number
    ) => {
        if (!note.uuid) {
            return;
        }
        const noteReadData: NoteRead = {
            note_id: note.uuid ? note.uuid : "",
            user_id: note.to_user_id ? note.to_user_id : "",
            created_at: note?.created_at,
            last_read: new Date().toISOString(),
            starred: false
        };
        if (user?.id === note.user_id) {
            setSelectedNote(note);
            setNoteReadModalOpen(true);
            return;
        }
        if (noteDistanceFromUser < proximityRadius || note.read === true) {
            // Find note read with note_id matching note.uuid and to_user_id matching user.id
            const existingRead = noteReads.find(
                (noteRead: NoteRead) =>
                    noteRead?.note_id === note.uuid &&
                    noteRead?.user_id === note.to_user_id
            );
            setSelectedNote(note);
            setNoteReadModalOpen(true);
            const currentTime = new Date().toISOString();
            const updatedNoteWithRead = {
                ...note,
                read: true,
                last_read: currentTime
            };
            if (!existingRead) {
                const addResponse = await addNoteRead(noteReadData);
                if (addResponse) {
                    updateNoteInStore(updatedNoteWithRead);
                    addNoteReadToStore(addResponse);
                }
                return;
            } else if (existingRead) {
                const updateResponse = await updateNoteRead(
                    existingRead.uuid,
                    currentTime
                );
                updateNoteInStore(updatedNoteWithRead);
                updateNoteReadInStore(updateResponse);
                return;
            }
        } else {
            setDistanceToNote(noteDistanceFromUser);
            setBlockRead(true);
            return;
        }
    };

    // Get notes from database for this user, iterating through them and add them to the note store
    useEffect(() => {
        if (noteReadsLoading) {
            return;
        }
        setNotesLoading(true);
        const returnNotesFromDB = async () => {
            const getNotesFromDatabase = async () => {
                // Find the date of the most recent last_read note
                let cutOffDate = "";
                if (notes.length > 0) {
                    const mostRecentNote = notes.reduce(
                        (prev: any, current: any) =>
                            prev?.created_at > current?.created_at
                                ? prev
                                : current
                    );
                    if (mostRecentNote) {
                        cutOffDate = mostRecentNote.created_at;
                    }
                }
                const notesResponse = await getNotes(user?.id, "", 0, 100);

                if (!notesResponse) {
                    return;
                }
                const { userNotes, count } = notesResponse;
                let notesRetrieved = 0;
                const currentNoteStore = notes ? notes : [];
                const newNoteStore = [...userNotes]; //[...currentNoteStore, ...userNotes];
                // Remove duplicates
                const uniqueNotes = newNoteStore.filter(
                    (note: Note, index: number) =>
                        newNoteStore.findIndex(
                            (note2: Note) => note2.uuid === note.uuid
                        ) === index
                );

                var notesRetrievedData = uniqueNotes;
                notesRetrieved += userNotes.length;
                if (!count) {
                    return;
                }
                if (userNotes.length < count) {
                    const getMoreNotes = async () => {
                        const moreNotes = await getNotes(
                            user?.id,
                            cutOffDate,
                            notesRetrieved,
                            notesRetrieved + 100
                        );
                        if (!moreNotes) {
                            return;
                        }
                        notesRetrievedData = [
                            ...notesRetrievedData,
                            ...moreNotes.userNotes
                        ];
                        notesRetrieved += moreNotes.userNotes.length;
                        if (notesRetrieved < count) {
                            getMoreNotes();
                        }
                    };
                    getMoreNotes();
                }
                return notesRetrievedData;
            };
            // Call getNotesFromDatabase and return the data
            const data = await getNotesFromDatabase();
            if (data) {
                const updatedWithVisibility = updateVisibleNotes(data);
                setNotesInStore(updatedWithVisibility);
            }
            return data;
        };
        returnNotesFromDB();
        setNotesLoading(false);
    }, [noteReadsLoading]);

    // Get note reads from database for this user, iterating through them and add them to the note read store
    useEffect(() => {
        setNoteReadsLoading(true);
        const returnNoteReadsFromDB = async () => {
            const getNoteReadsFromDatabase = async () => {
                // Find the date of the most recent last_read note
                let cutOffDate = "";
                if (noteReads.length > 0) {
                    const mostRecentNoteRead = noteReads.reduce(
                        (prev: any, current: any) =>
                            prev?.created_at > current?.created_at
                                ? prev
                                : current
                    );
                    if (mostRecentNoteRead) {
                        cutOffDate = mostRecentNoteRead.created_at;
                    }
                }
                const notesResponse = await getNoteReads(user?.id, "", 0, 100);
                if (!notesResponse) {
                    return;
                }
                const { userNoteReads, count } = notesResponse;
                let noteReadsRetrieved = 0;
                //const currentNoteReadStore = noteReads ? noteReads : [];
                const newNoteReadStore = [...userNoteReads]; // [...currentNoteReadStore, ...userNoteReads];
                // Remove duplicates
                const uniqueNoteReads = newNoteReadStore.filter(
                    (noteRead: NoteRead, index: number) =>
                        newNoteReadStore.findIndex(
                            (noteRead2: NoteRead) =>
                                noteRead2?.note_id === noteRead?.note_id
                        ) === index
                );
                var notesReadRetrievedData = uniqueNoteReads;
                if (uniqueNoteReads.length === 0) {
                    notesReadRetrievedData = [];
                }
                noteReadsRetrieved += userNoteReads.length;
                if (!count) {
                    return [];
                }
                if (userNoteReads.length < count) {
                    const getMoreNotes = async () => {
                        const moreNotes = await getNoteReads(
                            user?.id,
                            "",
                            noteReadsRetrieved,
                            noteReadsRetrieved + 100
                        );
                        if (!moreNotes) {
                            return;
                        }
                        notesReadRetrievedData = [
                            ...notesReadRetrievedData,
                            ...moreNotes.userNoteReads
                        ];
                        noteReadsRetrieved += moreNotes.userNoteReads.length;
                        if (noteReadsRetrieved < count) {
                            getMoreNotes();
                        }
                    };
                    getMoreNotes();
                }
                return notesReadRetrievedData;
            };
            const data = await getNoteReadsFromDatabase();
            setNoteReadsInStore(data ? data : []);
            return data;
        };
        returnNoteReadsFromDB();
        setNoteReadsLoading(false);
    }, []);

    // Get user's connections from the database and add them to the store
    useEffect(() => {
        const getUserConnectionsFromDatabase = async () => {
            const connections = await getUserConnections(user?.id);
            if (connections) {
                setConnectionsInStore(connections);
            }
        };
        getUserConnectionsFromDatabase();
    }, []);

    return (
        <div className="relative h-[100%] w-[100%]">
            <BaseMap
                mapCenter={userLatLng}
                mapStyle={mapStyle}
                mapZoom={currentZoom}
                onSelectedPoint={(point) => {
                    handleSelectedPoint(point);
                }}
                userCurrentLocation={(e) =>
                    setUserLatLng({
                        lat: e.coords.latitude,
                        lng: e.coords.longitude
                    })
                }
                currentZoomLevel={(e) => setCurrentZoom(e)}
            >
                <div className="absolute flex left-0 top-0 pt-4 ml-2 cursor-pointer">
                    <span className="py-1 px-2 rounded-md bg-blue-500 bg-opacity-50 font-semibold text-white">
                        unmpd
                    </span>
                </div>
                <div className="absolute flex left-0 bottom-12 pt-4 ml-2 justify-items-center">
                    <UserButton />
                </div>
                <div className="absolute flex right-0 top-0 pt-4 mr-2 justify-items-center">
                    <Menu
                        openMenu={menuSelected}
                        handleSelection={
                            menuSelected === "main"
                                ? () => setMenuSelected("")
                                : () => setMenuSelected("main")
                        }
                    />
                </div>
                <div className="absolute flex right-0 top-12 pt-4 mr-2 justify-items-center">
                    <MapStyleMenu
                        openMenu={menuSelected}
                        handleSelection={
                            menuSelected === "style"
                                ? () => setMenuSelected("")
                                : () => setMenuSelected("style")
                        }
                        handleStyleSelection={(e) => setMapStyle(e)}
                    />
                </div>
                {notes.map((note: Note) => {
                    const noteDistance = haversine(
                        userLatLng.lat,
                        userLatLng.lng,
                        note.latitude,
                        note.longitude
                    );
                    return (
                        <div
                            key={note.uuid}
                            onClick={() => {
                                console.log("Note clicked", note);
                                handleNoteClick(note, noteDistance);
                            }}
                        >
                            <NoteMarker
                                note={note}
                                withinProximity={
                                    noteDistance < proximityRadius
                                        ? true
                                        : false
                                }
                                currentUserIsAuthor={note.user_id === user?.id}
                            />
                        </div>
                    );
                })}
                <CreateNoteModal
                    show={noteReadModalOpen ? false : noteCreateModalOpen}
                    coordinates={selectedPoint}
                    handleClose={() => {
                        setNoteCreateModalOpen(false);
                    }}
                />
                <ReadNoteModal
                    show={noteReadModalOpen}
                    note={selectedNote}
                    handleClose={() => {
                        setSelectedNote(null);
                        setNoteReadModalOpen(false);
                        setNoteCreateModalOpen(false);
                    }}
                />
                <TooFarAlert
                    show={blockRead}
                    handleClose={() => {
                        setBlockRead(false);
                    }}
                    distanceToNote={
                        distanceToNote < 2
                            ? Math.round(
                                  distanceToNote * 1000 - 100
                              ).toLocaleString()
                            : distanceToNote > 10
                            ? Math.round(distanceToNote).toLocaleString()
                            : distanceToNote.toFixed(1)
                    }
                    distanceToNoteUnit={
                        distanceToNote < 2
                            ? DistanceToNoteUnit.METERS
                            : DistanceToNoteUnit.KILOMETERS
                    }
                />
                <ZoomInAlert
                    show={zoomAlert}
                    handleClose={() => {
                        setZoomAlert(false);
                        setCurrentZoom(13);
                    }}
                    selectedPoint={selectedPoint}
                />
            </BaseMap>
        </div>
    );
}
