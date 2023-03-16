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

const proximityRadius = 5;

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
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
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
        if (!blockRead) {
            setSelectedPoint(point);
            setNoteCreateModalOpen(true);
        }
    };

    const userLocation = async () => {
        const location = await getUserLocation();
        return location;
    };

    useEffect(() => {
        userLocation().then((location) => {
            if (location !== null) {
                setUserLatLng(location);
            }
        });
    }, []);

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

    return (
        <div className="relative">
            <BaseMap
                initialCenter={userLatLng}
                onSelectedPoint={(point) => {
                    handleSelectedPoint(point);
                }}
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
                                    alert("You are too far away");
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
            </BaseMap>
        </div>
    );
}
