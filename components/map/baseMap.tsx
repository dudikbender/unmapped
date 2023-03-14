import { FC, useEffect, useState } from "react";
import Map, {
    Source,
    Layer,
    NavigationControl,
    Popup,
    Marker
} from "react-map-gl";
import { LoadingMapSpinner } from "./loadingMap";

type Props = {
    children: React.ReactNode | Array<React.ReactNode>;
    initialCenter: { lat: number; lng: number };
    onSelectedPoint: (point: { lat: number; lng: number }) => void;
};

export const BaseMap: FC<Props> = ({
    children,
    initialCenter,
    onSelectedPoint
}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [features, setFeatures] = useState({
        type: "FeatureCollection",
        features: []
    });
    const [zoomLevel, setZoomLevel] = useState<number>(14);
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 100);
    }, [initialCenter]);

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
                    pitch={45}
                    onClick={(e) => {
                        onSelectedPoint(e.lngLat);
                    }}
                    onZoomEnd={(e) => {
                        setZoomLevel(e.viewState.zoom);
                    }}
                >
                    <div>
                        <NavigationControl
                            position={"bottom-right"}
                            visualizePitch={true}
                        />
                    </div>
                    {children}
                </Map>
            </div>
        </>
    );
};
