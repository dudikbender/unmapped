import { useState } from "react";
import { BaseMap } from "@/components/map/baseMap";
import { NoteMarker } from "@/components/map/noteMarker";
import { Menu } from "@/components/menu/menu";
import { CreateNoteModal } from "@/components/modals/createNote";
import { useNoteStore } from "@/services/stores/noteStore";
import { Note } from "@/services/types/note";

export default function Home() {
    const [noteCreateModalOpen, setNoteCreateModalOpen] = useState(false);
    const [selectedPoint, setSelectedPoint] = useState<{
        lat: number;
        lng: number;
    } | null>(null);
    const { notes } = useNoteStore();
    const handleSelectedPoint = (point: { lat: number; lng: number }) => {
        console.log("Lat: " + point.lat + " Lng: " + point.lng);
        setSelectedPoint(point);
        setNoteCreateModalOpen(true);
    };

    // Console log each note in the store
    notes.forEach((note: Object) => {
        console.log(note);
    });
    return (
        <div className="relative">
            <BaseMap
                onSelectedPoint={(point) => {
                    handleSelectedPoint(point);
                }}
            >
                <div className="absolute hidden sm:flex inset-x-0 top-0 pt-4 justify-items-center">
                    <div className="m-auto p-2 cursor-default text-lg">
                        unmapped
                    </div>
                </div>
                <div className="absolute flex left-0 top-0 pt-4 justify-items-center">
                    <Menu />
                </div>
                <div className="absolute flex right-0 top-0 pt-4 justify-items-center">
                    <div
                        className="rounded-md bg-white m-auto p-2 mr-2 cursor-default text-lg 
                                    hover:bg-gray-400 hover:text-white hover:cursor-pointer"
                    >
                        profile
                    </div>
                </div>
                {notes.map((note: Note) => {
                    return (
                        <NoteMarker
                            key={note.id}
                            latitude={note.latitude}
                            longitude={note.longitude}
                        />
                    );
                })}
                <CreateNoteModal
                    show={noteCreateModalOpen}
                    coordinates={selectedPoint}
                    handleClose={() => {
                        setNoteCreateModalOpen(false);
                    }}
                />
            </BaseMap>
        </div>
    );
}
