import { FC } from "react";
import Map, { Source, Layer, NavigationControl, Popup } from "react-map-gl";

type Props = {
    children: React.ReactNode | Array<React.ReactNode>;
};

export const BaseMap: FC<Props> = ({ children }) => {
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
