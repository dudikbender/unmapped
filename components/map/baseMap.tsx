import { FC, useState, useCallback } from "react";
import Map, {
    MapProvider,
    Source,
    Layer,
    NavigationControl,
    GeolocateResultEvent,
    AttributionControl
} from "react-map-gl";
import { UserLocator } from "./userLocator";

type Props = {
    children: React.ReactNode | Array<React.ReactNode>;
    mapCenter: { lat: number; lng: number };
    mapZoom?: number;
    onSelectedPoint: (point: { lat: number; lng: number }) => void;
    userCurrentLocation?: (value: GeolocateResultEvent) => void;
    currentZoomLevel?: (value: number) => void;
};

export const BaseMap: FC<Props> = ({
    children,
    mapCenter,
    mapZoom,
    onSelectedPoint,
    userCurrentLocation,
    currentZoomLevel
}) => {
    const [features, setFeatures] = useState({
        type: "FeatureCollection",
        features: []
    });
    const geolocateControlRef = useCallback((ref: any) => {
        if (ref) {
            // Activate half a second after map
            setTimeout(() => {
                ref.trigger();
            }, 250);
        }
    }, []);

    return (
        <>
            <div style={{ height: "100vh", width: "100%" }}>
                <MapProvider>
                    <Map
                        id="baseMap"
                        initialViewState={{
                            latitude: mapCenter.lat,
                            longitude: mapCenter.lng,
                            zoom: mapZoom || 1
                        }}
                        mapStyle="mapbox://styles/mapbox/light-v9"
                        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
                        pitch={0}
                        onClick={(e) => {
                            onSelectedPoint(e.lngLat);
                        }}
                        onZoomEnd={(e) => {
                            if (currentZoomLevel) {
                                currentZoomLevel(e.viewState.zoom);
                            }
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
                        <AttributionControl
                            compact={true}
                            position={"bottom-left"}
                            customAttribution="Upmapped 2023"
                        />
                    </Map>
                </MapProvider>
            </div>
        </>
    );
};
