import { UserConnection } from "@/services/types/connections";
import { Note } from "@/services/types/note";
import { FC } from "react";
import { MapRef } from "react-map-gl";
import { NoteItem } from "./noteItem";

type Props = {
    notes: Note[];
    connections: UserConnection[];
    mapObject: MapRef | undefined;
    handleClose: () => void;
};

export const NoteList: FC<Props> = ({
    notes,
    connections,
    mapObject,
    handleClose
}) => {
    return (
        <>
            <ul className="sm:divide-y sm:divide-blue-100">
                {notes.map((note: Note) => (
                    <div key={note.uuid} className="py-1 cursor-default">
                        <li>
                            <NoteItem
                                note={note}
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
