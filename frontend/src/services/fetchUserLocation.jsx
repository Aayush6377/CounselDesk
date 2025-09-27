import axios from "axios";

const url = "https://nominatim.openstreetmap.org";

const mapApi = axios.create({
    baseURL: url
});

const fetchUserLocation = async () => {
    return new Promise((resolve) => {
        if (!navigator.geolocation){
            resolve(null);
            return;
        }

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude: lat, longitude: lon } = position.coords;

            try {
                const res = await mapApi.get("/reverse",{
                    params: {
                        format: "json",
                        lat, lon
                    },
                    headers: {
                      'Accept-Language': 'en'
                    }
                });

                const data = res.data;

                if (data?.address){
                    resolve({
                        city: data.address.city || data.address.town || data.address.village,
                        state: data.address.state
                    });
                }
                else{
                    resolve(null);
                }
            } catch (error) {
                console.error("Failed to fetch address:", error);
                resolve(null);
            }
        }, (error) => {
            console.error("Geolocation error:", error.message);
            resolve(null); 
        }, {
            enableHighAccuracy: true
        });
    });
}

export default fetchUserLocation;