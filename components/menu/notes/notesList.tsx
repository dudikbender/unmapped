import { Note } from "@/services/types/note";
import { FC } from "react";
import { MapRef } from "react-map-gl";
import { NoteListItem } from "./noteListItem";

type Props = {
    notes: Note[];
    recipient: boolean;
    mapObject: MapRef | undefined;
    handleClose: () => void;
};

export const NoteList: FC<Props> = ({
    notes,
    recipient,
    mapObject,
    handleClose
}) => {
    return (
        <>
            <ul className="sm:divide-y sm:divide-blue-200">
                {notes.map((note: Note) => (
                    <div key={note.uuid} className="py-2 cursor-default">
                        <li>
                            <NoteListItem
                                note={note}
                                recipient={recipient}
                                mapObject={mapObject}
                                handleClose={handleClose}
                            />
                        </li>
                    </div>
                ))}
            </ul>
        </>
    );
};
