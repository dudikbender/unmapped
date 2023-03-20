import { FC, useState, useEffect } from "react";
import { Marker } from "react-map-gl";
import {
    EnvelopeIcon,
    EnvelopeOpenIcon,
    PaperAirplaneIcon
} from "@heroicons/react/24/outline";

type Props = {
    latitude: number;
    longitude: number;
    availableToOpen: boolean;
    alreadyOpened: boolean;
    currentUserIsAuthor: boolean;
};

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

export const NoteMarker: FC<Props> = ({
    latitude,
    longitude,
    availableToOpen,
    alreadyOpened,
    currentUserIsAuthor
}) => {
    const [canOpen, setCanOpen] = useState<boolean>(availableToOpen);
    const [previouslyOpened, setPreviouslyOpened] =
        useState<boolean>(alreadyOpened);

    useEffect(() => {
        setCanOpen(availableToOpen);
        setPreviouslyOpened(alreadyOpened);
    }, [availableToOpen, alreadyOpened]);

    return (
        <Marker
            latitude={latitude}
            longitude={longitude}
            anchor="bottom"
            draggable={true}
            onDragEnd={(e) => {
                console.log(e.lngLat);
            }}
        >
            <div
                className={classNames(
                    currentUserIsAuthor
                        ? "bg-purple-500"
                        : previouslyOpened
                        ? "bg-green-600 ring-white"
                        : canOpen
                        ? "bg-blue-500"
                        : "bg-gray-500",
                    "text-white p-2 rounded-full hover:cursor-pointer shadow-lg ring-inset-1 ring-1 ring-gray-900"
                )}
            >
                {currentUserIsAuthor ? (
                    <PaperAirplaneIcon className="h-4 w-4" />
                ) : previouslyOpened ? (
                    <EnvelopeOpenIcon className="h-4 w-4" />
                ) : canOpen ? (
                    <EnvelopeIcon className="h-4 w-4" />
                ) : (
                    <EnvelopeIcon className="h-4 w-4" />
                )}
            </div>
        </Marker>
    );
};
