import { useState, useEffect } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { BaseMap } from "@/components/map/baseMap";
import { NoteMarker } from "@/components/map/noteMarker";
import { Menu } from "@/components/menu/menu";
import { CreateNoteModal } from "@/components/modals/createNote";
import { ReadNoteModal } from "@/components/modals/readNote";
import { useNoteStore } from "@/services/stores/noteStore";
import { useConnectionStore } from "@/services/stores/connectionStore";
import { Note } from "@/services/types/note";
import { LatLng } from "@/services/types/latlng";
import { getNotes } from "@/services/database/getNotes";
import { getUserLocation } from "@/services/users/getUserLocation";
import { haversine } from "@/services/geo/haversine";
import { getUserConnections } from "@/services/users/getUserConnections";
import { TooFarAlert, DistanceToNoteUnit } from "@/components/modals/tooFar";
import { ZoomInAlert } from "@/components/modals/zoomInAlert";

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
            if (!blockRead) {
                setZoomAlert(true);
            }
        }
    };

    useEffect(() => {
        const getNotesFromDatabase = async () => {
            const notes = await getNotes();
            setNotesInStore(notes);
        };
        getNotesFromDatabase();
    }, []);

    useEffect(() => {
        if (noteReadModalOpen) {
            setNoteCreateModalOpen(false);
        }
    }, [noteReadModalOpen]);

    console.log(currentZoom);

    return (
        <div className="relative">
            <BaseMap
                mapCenter={userLatLng}
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
                <div className="absolute flex left-0 top-0 pt-4 ml-2 justify-items-center">
                    <UserButton />
                </div>
                <div className="absolute flex right-0 top-0 pt-4 mr-2 justify-items-center">
                    <Menu />
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
                    }}
                />
            </BaseMap>
        </div>
    );
}
