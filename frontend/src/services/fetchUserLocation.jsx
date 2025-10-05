import axios from "axios";

const url = "https://nominatim.openstreetmap.org";
const CACHE_KEY = "userLocationCache";
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000;

const mapApi = axios.create({
    baseURL: url
});

const fetchUserLocation = async () => {
    const cachedItem = localStorage.getItem(CACHE_KEY);
    if (cachedItem) {
        try {
            const { location, expiry } = JSON.parse(cachedItem);
            if (new Date().getTime() < expiry) {
                console.log("Returning location from cache.");
                return location;
            }
        } catch (error) {
            console.error("Failed to parse cached location data:", error);
            localStorage.removeItem(CACHE_KEY);
        }
    }

    return new Promise((resolve) => {
        if (!navigator.geolocation) {
            resolve(null);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude: lat, longitude: lon } = position.coords;
                try {
                    const res = await mapApi.get("/reverse", {
                        params: { format: "json", lat, lon },
                        headers: { 'Accept-Language': 'en' }
                    });

                    const data = res.data;

                    if (data?.address) {
                        const location = {
                            city: data.address.city || data.address.town || data.address.village || data.address.county,
                            state: data.address.state
                        };

                        const expiry = new Date().getTime() + CACHE_DURATION_MS;
                        localStorage.setItem(CACHE_KEY, JSON.stringify({ location, expiry }));
                        
                        resolve(location);
                    } else {
                        resolve(null);
                    }
                } catch (error) {
                    console.error("Failed to fetch address:", error);
                    resolve(null);
                }
            },
            (error) => {
                console.error("Geolocation error:", error.message);
                resolve(null);
            },
            {
                enableHighAccuracy: true
            }
        );
    });
};

export default fetchUserLocation;
