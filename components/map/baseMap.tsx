import { FC, useState } from "react";
import Map, { Source, Layer, NavigationControl, Popup } from "react-map-gl";
import { Toolbox } from "@nebula.gl/editor";
import { ViewMode, DrawPolygonMode } from "@nebula.gl/edit-modes";
import { EditableGeoJsonLayer } from "@nebula.gl/layers";

type Props = {
    children: React.ReactNode | Array<React.ReactNode>;
    onSelectedPoint: (point: { lat: number; lng: number }) => void;
};

type LatLng = {
    lat: number;
    lng: number;
};

export const BaseMap: FC<Props> = ({ children, onSelectedPoint }) => {
    const [features, setFeatures] = useState({
        type: "FeatureCollection",
        features: []
    });
    const [selectedPoint, setSelectedPoint] = useState<LatLng | null>(null);
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
                    pitch={60}
                    onClick={(e) => {
                        onSelectedPoint(e.lngLat);
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
