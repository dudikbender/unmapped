import { FC, useEffect, useState, useCallback } from "react";
import Map, {
    Source,
    Layer,
    NavigationControl,
    Popup,
    Marker,
    GeolocateResultEvent
} from "react-map-gl";
import { UserLocator } from "./userLocator";
import { LoadingMapSpinner } from "./loadingMap";

type Props = {
    children: React.ReactNode | Array<React.ReactNode>;
    initialCenter: { lat: number; lng: number };
    onSelectedPoint: (point: { lat: number; lng: number }) => void;
    userCurrentLocation?: (value: GeolocateResultEvent) => void;
};

export const BaseMap: FC<Props> = ({
    children,
    initialCenter,
    onSelectedPoint,
    userCurrentLocation
}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [features, setFeatures] = useState({
        type: "FeatureCollection",
        features: []
    });
    const [zoomLevel, setZoomLevel] = useState<number>(14);
    const geolocateControlRef = useCallback((ref: any) => {
        if (ref) {
            // Activate 1 second after map
            setTimeout(() => {
                ref.trigger();
            }, 500);
        }
    }, []);

    if (loading) {
        return (
            <div className="grid h-screen place-items-center">
                <LoadingMapSpinner height={12} width={12} />
                <span>Flying to you now...</span>
            </div>
        );
    }
    return (
        <>
            <div style={{ height: "100vh", width: "100%" }}>
                <Map
                    initialViewState={{
                        latitude: initialCenter.lat,
                        longitude: initialCenter.lng,
                        zoom: 12
                    }}
                    mapStyle="mapbox://styles/mapbox/light-v9"
                    mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
                    pitch={0}
                    onClick={(e) => {
                        onSelectedPoint(e.lngLat);
                    }}
                    onZoomEnd={(e) => {
                        setZoomLevel(e.viewState.zoom);
                    }}
                    projection="globe"
                    terrain={{
                        source: "mapbox-raster-dem",
                        exaggeration: 2
                    }}
                >
                    <div>
                        <NavigationControl
                            position={"bottom-right"}
                            visualizePitch={true}
                        />
                    </div>
                    <div>
                        <UserLocator
                            innerRef={geolocateControlRef}
                            onCurrentLocation={(e) => {
                                if (userCurrentLocation) {
                                    userCurrentLocation(e);
                                }
                            }}
                        />
                    </div>
                    {children}
                </Map>
            </div>
        </>
    );
};
