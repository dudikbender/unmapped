import { ArrowRightCircleIcon } from "@heroicons/react/24/outline";
import { Note } from "@/services/types/note";
import { flyToNoteLocation } from "./flyToNoteLocation";
import { MapRef } from "react-map-gl";
import { FC } from "react";
import { useConnectionStore } from "@/services/stores/connectionStore";
import { UserConnection } from "@/services/types/connections";
import { haversine } from "@/services/geo/haversine";
import { DistanceToNoteUnit } from "@/components/modals/tooFar";
import Image from "next/image";

type Props = {
    note: Note;
    recipient: boolean;
    mapObject: MapRef | undefined;
    handleClose: () => void;
};

export const NoteListItem: FC<Props> = ({
    note,
    recipient,
    mapObject,
    handleClose
}) => {
    const { connections } = useConnectionStore();
    const noteSender = connections.find(
        (connection: UserConnection) => connection.userId === note.user_id
    );
    const noteReceipient = connections.find(
        (connection: UserConnection) => connection.userId === note.to_user_id
    );
    const mapCenter = mapObject?.getMap().getCenter();
    var distance = 0;
    if (mapCenter) {
        const distanceToNote = haversine(
            mapCenter.lat,
            mapCenter.lng,
            note.latitude,
            note.longitude
        );
        distance = distanceToNote;
    }
    const formattedDistance =
        distance < 2
            ? Math.round(distance * 1000 - 100).toLocaleString()
            : distance > 10
            ? Math.round(distance).toLocaleString()
            : distance.toFixed(1);

    const distanceToNoteUnit =
        distance < 2
            ? DistanceToNoteUnit.METERS
            : DistanceToNoteUnit.KILOMETERS;

    return (
        <>
            <div className="flex items-center justify-between">
                {note?.content ? (
                    <div>
                        <span className="text-sm text-gray-900">
                            {recipient ? (
                                <div className="flex">
                                    <Image
                                        src={noteSender?.profileImageUrl}
                                        alt={`Note from ${noteSender?.firstName} ${noteSender?.lastName}.`}
                                        className="rounded-full h-6 w-6 flex-none inline-block"
                                        width={20}
                                        height={20}
                                        title={`from ${noteSender?.firstName} ${noteSender?.lastName}.`}
                                    />
                                    <span className="ml-2">
                                        {`${noteSender?.firstName} ${noteSender?.lastName[0]}.`}
                                    </span>
                                </div>
                            ) : (
                                <div className="flex">
                                    <Image
                                        src={noteReceipient?.profileImageUrl}
                                        alt={`Note to ${noteReceipient?.firstName} ${noteReceipient?.lastName}.`}
                                        className="rounded-full h-6 w-6 flex-none inline-block"
                                        width={20}
                                        height={20}
                                    />
                                    <span className="ml-2">
                                        {`to ${noteReceipient?.firstName} ${noteReceipient?.lastName[0]}.`}
                                    </span>
                                </div>
                            )}
                        </span>
                        <span className="text-sm text-gray-900 font-semibold">
                            {note?.content}
                        </span>
                    </div>
                ) : (
                    <div>
                        <span className="text-sm text-gray-900">
                            <div className="flex">
                                <Image
                                    src={noteSender?.profileImageUrl}
                                    alt="Profile Image"
                                    className="rounded-full h-6 w-6 flex-none inline-block"
                                    width={20}
                                    height={20}
                                />
                                <span className="ml-2">
                                    {`${noteSender?.firstName} ${noteSender?.lastName[0]}.`}
                                </span>
                            </div>
                        </span>
                        <span className="text-sm text-gray-500">{`~ ${formattedDistance} ${distanceToNoteUnit} from here.`}</span>
                    </div>
                )}
                <ArrowRightCircleIcon
                    className="h-6 w-6 flex-none rounded-full inline-block ml-2 text-blue-500 hover:bg-blue-500 hover:text-white hover:cursor-pointer"
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
            </div>
        </>
    );
};
