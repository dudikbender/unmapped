import { MapRef } from "react-map-gl";

export const flyToNoteLocation = (
    mapObject: MapRef | undefined,
    noteLocation: { lat: number; lng: number },
    handleClose: () => void
) => {
    if (!mapObject) return;
    mapObject?.flyTo({
        center: [noteLocation.lng, noteLocation.lat],
        zoom: 15,
        speed: 1.25
    });
    handleClose();
};
