import { Note } from "@/services/types/note";
import { FC } from "react";
import { MapRef } from "react-map-gl";
import { NoteListItem } from "../notes/noteListItem";
import { useUser } from "@clerk/nextjs";

type Props = {
    notes: Note[];
    mapObject: MapRef | undefined;
    handleClose: () => void;
};

export const NotesFromConnection: FC<Props> = ({
    notes,
    mapObject,
    handleClose
}) => {
    const { user } = useUser();
    return (
        <>
            <ul className="sm:divide-y sm:divide-blue-200">
                {notes.map((note: Note) => (
                    <div key={note.uuid} className="py-2 cursor-default">
                        <li>
                            <NoteListItem
                                note={note}
                                recipient={true}
                                mapObject={mapObject}
                                handleClose={handleClose}
                                includeSenderName={false}
                            />
                        </li>
                    </div>
                ))}
            </ul>
        </>
    );
};
