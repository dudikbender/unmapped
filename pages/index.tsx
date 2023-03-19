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
import { Note } from "@/services/types/note";
import { LatLng } from "@/services/types/latlng";
import { getNotes } from "@/services/database/getNotes";
import { haversine } from "@/services/geo/haversine";
import { getUserConnections } from "@/services/users/getUserConnections";
import { TooFarAlert, DistanceToNoteUnit } from "@/components/modals/tooFar";
import { ZoomInAlert } from "@/components/modals/zoomInAlert";
import { MapStyle } from "@/services/types/mapObjects";

const proximityRadius = 0.2; // 0.2km

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
    const [mapStyle, setMapStyle] = useState<MapStyle>(MapStyle.SATELLITE);
    const [menuSelected, setMenuSelected] = useState<string | null>(null);
    const { notes, setNotesInStore } = useNoteStore();
    const { setConnectionsInStore } = useConnectionStore();

    useEffect(() => {
        const getUserConnectionsFromDatabase = async () => {
            const connections = await getUserConnections(user?.id);
            if (connections) {
                setConnectionsInStore(connections);
            }
        };
        getUserConnectionsFromDatabase();
    }, []);

    // Filter notes to only show those where user_id matches user.id or to_user_id matches user.id
    const visibleNotes = notes.filter((note: Note) => {
        if (note.user_id === user?.id || note.to_user_id === user?.id) {
            return note;
        }
    });

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

    // Get notes from database for this user, iterating through them and add them to the note store
    useEffect(() => {
        const getNotesFromDatabase = async () => {
            const notesResponse = await getNotes(user?.id);
            if (!notesResponse) {
                return;
            }
            const { userNotes, count } = notesResponse;
            let notesRetrieved = 0;
            setNotesInStore(userNotes);
            notesRetrieved += userNotes.length;
            if (!count) {
                return;
            }
            if (userNotes.length < count) {
                const getMoreNotes = async () => {
                    const moreNotes = await getNotes(
                        user?.id,
                        notesRetrieved,
                        notesRetrieved + 100
                    );
                    if (!moreNotes) {
                        return;
                    }
                    setNotesInStore([...notes, ...moreNotes.userNotes]);
                    notesRetrieved += moreNotes.userNotes.length;
                    if (notesRetrieved < count) {
                        getMoreNotes();
                    }
                };
                getMoreNotes();
            }
        };
        getNotesFromDatabase();
    }, []);

    useEffect(() => {
        if (noteReadModalOpen) {
            setNoteCreateModalOpen(false);
        }
    }, [noteReadModalOpen]);

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
                {visibleNotes.map((note: Note) => {
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
                                if (
                                    noteDistance < proximityRadius ||
                                    user?.id === note.user_id
                                ) {
                                    setSelectedNote(note);
                                    setNoteReadModalOpen(true);
                                } else {
                                    setDistanceToNote(noteDistance);
                                    setBlockRead(true);
                                }
                            }}
                        >
                            <NoteMarker
                                key={note.id}
                                latitude={note.latitude}
                                longitude={note.longitude}
                                availableToOpen={noteDistance < proximityRadius}
                                alreadyOpened={false}
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
