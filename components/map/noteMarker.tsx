import { FC, useState, useEffect } from "react";
import { Marker } from "react-map-gl";
import {
    EnvelopeIcon,
    EnvelopeOpenIcon,
    PaperAirplaneIcon
} from "@heroicons/react/24/outline";
import { useNoteStore } from "@/services/stores/noteStore";
import { Note } from "@/services/types/note";

type Props = {
    note: Note | null;
    withinProximity: boolean;
    currentUserIsAuthor: boolean;
};

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

export const NoteMarker: FC<Props> = ({
    note,
    withinProximity,
    currentUserIsAuthor
}) => {
    if (!note) {
        return null;
    }

    return (
        <Marker
            latitude={note?.latitude}
            longitude={note?.longitude}
            anchor="bottom"
            draggable={true}
            onDragEnd={(e) => {
                console.log("New Location: ", e.lngLat);
            }}
        >
            <div
                key={note.uuid}
                className={classNames(
                    currentUserIsAuthor
                        ? "bg-purple-500"
                        : note?.read
                        ? "bg-green-600 ring-white"
                        : withinProximity
                        ? "bg-blue-500"
                        : "bg-gray-500",
                    "text-white p-2 rounded-full hover:cursor-pointer shadow-lg ring-inset-1 ring-1 ring-gray-900"
                )}
            >
                {currentUserIsAuthor ? (
                    <PaperAirplaneIcon className="h-4 w-4" />
                ) : note?.read ? (
                    <EnvelopeOpenIcon className="h-4 w-4" />
                ) : withinProximity ? (
                    <EnvelopeIcon className="h-4 w-4" />
                ) : (
                    <EnvelopeIcon className="h-4 w-4" />
                )}
            </div>
        </Marker>
    );
};
