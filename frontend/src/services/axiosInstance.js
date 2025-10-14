import axios from "axios";

const url = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
    baseURL: url,
    withCredentials: true
});

api.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("accessToken");

        if (accessToken) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (res) => res, 
    async (err) => {
        const originalRequest = err.config;

        if (err.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const res = await axios.post(`${url}/api/auth/refresh`, {}, { withCredentials: true });
                const newAccessToken = res.data.accessToken;

                localStorage.setItem("accessToken", newAccessToken);
                originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                
                return api(originalRequest);
            } catch (error) {
                console.error("Refresh failed", error);
                return Promise.reject(error);
            }
        }
        
        return Promise.reject(err);
    }
);

export default api;