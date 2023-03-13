import { FC, useState } from "react";
import Map, {
    Source,
    Layer,
    NavigationControl,
    Popup,
    Marker
} from "react-map-gl";

type Props = {
    children: React.ReactNode | Array<React.ReactNode>;
    onSelectedPoint: (point: { lat: number; lng: number }) => void;
};

export const BaseMap: FC<Props> = ({ children, onSelectedPoint }) => {
    const [features, setFeatures] = useState({
        type: "FeatureCollection",
        features: []
    });
    const [zoomLevel, setZoomLevel] = useState<number>(14);
    return (
        <>
            <div style={{ height: "100vh", width: "100%" }}>
                <Map
                    initialViewState={{
                        latitude: 51.486331388,
                        longitude: -0.186499254,
                        zoom: 14
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
