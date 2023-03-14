import { useState, useEffect } from "react";
import { UserButton } from "@clerk/nextjs";
import { BaseMap } from "@/components/map/baseMap";
import { NoteMarker } from "@/components/map/noteMarker";
import { Menu } from "@/components/menu/menu";
import { CreateNoteModal } from "@/components/modals/createNote";
import { ReadNoteModal } from "@/components/modals/readNote";
import { useNoteStore } from "@/services/stores/noteStore";
import { Note } from "@/services/types/note";
import { LatLng } from "@/services/types/latlng";
import { getNotes } from "@/services/database/getNotes";
import { getUserLocation } from "@/services/users/getUserLocation";

export default function Home() {
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
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const { notes, setNotesInStore } = useNoteStore();
    const handleSelectedPoint = (point: { lat: number; lng: number }) => {
        setSelectedPoint(point);
        setNoteCreateModalOpen(true);
    };

    const userLocation = async () => {
        const location = await getUserLocation();
        return location;
    };

    useEffect(() => {
        userLocation().then((location) => {
            if (location !== null) {
                console.log(location);
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
                {notes.map((note: Note) => {
                    return (
                        <div
                            key={note.id}
                            onClick={() => {
                                setSelectedNote(note);
                                setNoteReadModalOpen(true);
                            }}
                        >
                            <NoteMarker
                                key={note.id}
                                latitude={note.latitude}
                                longitude={note.longitude}
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
