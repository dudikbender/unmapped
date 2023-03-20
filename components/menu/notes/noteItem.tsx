import { ArrowRightCircleIcon } from "@heroicons/react/24/outline";
import { Note } from "@/services/types/note";
import { flyToNoteLocation } from "./flyToNoteLocation";
import { MapRef } from "react-map-gl";
import { FC } from "react";

type Props = {
    note: Note;
    mapObject: MapRef | undefined;
    handleClose: () => void;
};

export const NoteItem: FC<Props> = ({ note, mapObject, handleClose }) => {
    return (
        <>
            {note?.content ? (
                <span className="text-sm text-gray-500">
                    {`${note?.content}`}
                </span>
            ) : (
                <span className="text-sm text-gray-500">{`No content`}</span>
            )}
            <ArrowRightCircleIcon
                className="h-6 w-6 rounded-full inline-block ml-2 text-blue-500 hover:bg-blue-500 hover:text-white hover:cursor-pointer"
                onClick={() =>
                    flyToNoteLocation(
                        mapObject,
                        {
                            lat: note.latitude,
                            lng: note.longitude
                        },
                        handleClose
                    )
                }
            />
        </>
    );
};
