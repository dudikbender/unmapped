import { FC } from "react";
import { GeolocateControl, GeolocateResultEvent } from "react-map-gl";

export enum WidgetPosition {
    BOTTOM_RIGHT = "bottom-right",
    BOTTOM_LEFT = "bottom-left",
    TOP_RIGHT = "top-right",
    TOP_LEFT = "top-left"
}

type Props = {
    widgetPosition?: WidgetPosition;
    onCurrentLocation: (value: GeolocateResultEvent) => void;
    innerRef?: any;
};

export const UserLocator: FC<Props> = ({
    widgetPosition = WidgetPosition.BOTTOM_RIGHT,
    onCurrentLocation,
    innerRef
}) => {
    const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };
    return (
        <GeolocateControl
            ref={innerRef}
            position={widgetPosition}
            positionOptions={options}
            trackUserLocation={true}
            onGeolocate={(e) => onCurrentLocation(e)}
        />
    );
};
