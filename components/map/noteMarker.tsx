import { FC, useState } from "react";
import { Marker } from "react-map-gl";
import { EnvelopeIcon } from "@heroicons/react/24/outline";

type Props = {
    latitude: number;
    longitude: number;
};

export const NoteMarker: FC<Props> = ({ latitude, longitude }) => {
    const [opened, setOpened] = useState<boolean>(false);
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
            <div className="p-1 rounded-full bg-blue-500 text-white hover:cursor-pointer">
                <EnvelopeIcon className="h-3 w-3" />
            </div>
        </Marker>
    );
};
