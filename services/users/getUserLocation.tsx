import { LatLng } from "../types/latlng";
// Return the user's current location from the browser
export const getUserLocation = async (): Promise<LatLng> => {
    if (navigator.geolocation) {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => {
                    reject(error);
                }
            );
        });
    } else {
        throw new Error("Geolocation is not supported by this browser.");
    }
};
