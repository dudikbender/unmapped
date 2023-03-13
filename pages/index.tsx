import { useState, useEffect } from "react";
import { BaseMap } from "@/components/map/baseMap";
import { NoteMarker } from "@/components/map/noteMarker";
import { Menu } from "@/components/menu/menu";
import { CreateNoteModal } from "@/components/modals/createNote";
import { ReadNoteModal } from "@/components/modals/readNote";
import { useNoteStore } from "@/services/stores/noteStore";
import { Note } from "@/services/types/note";
import { getNotes } from "@/services/database/getNotes";

export default function Home() {
    const [selectedPoint, setSelectedPoint] = useState<{
        lat: number;
        lng: number;
    }>({ lat: 0, lng: 0 });
    const [noteCreateModalOpen, setNoteCreateModalOpen] = useState(false);
    const [noteReadModalOpen, setNoteReadModalOpen] = useState(false);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const { notes, setNotesInStore } = useNoteStore();
    const handleSelectedPoint = (point: { lat: number; lng: number }) => {
        console.log("Lat: " + point.lat + " Lng: " + point.lng);
        setSelectedPoint(point);
        setNoteCreateModalOpen(true);
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
    return (
        <div className="relative">
            <BaseMap
                onSelectedPoint={(point) => {
                    handleSelectedPoint(point);
                }}
            >
                <div className="absolute flex left-0 top-0 pt-4 ml-2 justify-items-center">
                    <div className="m-auto p-2 cursor-default text-lg">
                        unmapped
                    </div>
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
