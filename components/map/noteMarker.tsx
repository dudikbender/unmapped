import { FC, useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Marker } from "react-map-gl";
import {
    EnvelopeIcon,
    EnvelopeOpenIcon,
    PaperAirplaneIcon
} from "@heroicons/react/24/outline";
import { useNoteStore } from "@/services/stores/noteStore";
import { useNoteReadStore } from "@/services/stores/noteReadStore";
import { Note, NoteRead } from "@/services/types/note";

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
    const { noteReads } = useNoteReadStore();
    const { user } = useUser();
    // Const to check if the note uuid and user id is in the noteReads array
    const noteRead = noteReads.find(
        (noteRead: NoteRead) =>
            noteRead?.note_id === note?.uuid && noteRead.user_id === user?.id
    );
    if (!note || !note || !note?.latitude || !note?.longitude) {
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
                        : noteRead
                        ? "bg-green-600 ring-white"
                        : withinProximity
                        ? "bg-blue-500"
                        : "bg-gray-500",
                    "text-white p-2 rounded-full hover:cursor-pointer shadow-lg ring-inset-1 ring-1 ring-gray-900"
                )}
            >
                {currentUserIsAuthor ? (
                    <PaperAirplaneIcon className="h-4 w-4" />
                ) : noteRead ? (
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
