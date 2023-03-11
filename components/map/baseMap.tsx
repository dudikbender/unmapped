import Map, {
    Source,
    Layer,
    FullscreenControl,
    NavigationControl,
    Popup
} from "react-map-gl";

export const BaseMap = () => {
    return (
        <>
            <div style={{ height: "100vh", width: "100%" }}>
                <Map
                    initialViewState={{
                        latitude: 40,
                        longitude: -100,
                        zoom: 3
                    }}
                    mapStyle="mapbox://styles/mapbox/light-v9"
                    mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN} //"pk.eyJ1IjoiZGF2aWRiZW5kZXIiLCJhIjoiY2sxMmFzeWhmMGF0NjNjbWo5b3UzMmE2aiJ9.8iS9Doej1ZSwYZeljuL_lg"
                >
                    <FullscreenControl />
                    <div>
                        <NavigationControl
                            position={"bottom-right"}
                            visualizePitch={true}
                        />
                    </div>
                </Map>
            </div>
        </>
    );
};
