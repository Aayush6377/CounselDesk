import axios from "axios";

const url = "http://localhost:3000";

const api = axios.create({
    baseURL: url,
    withCredentials: true
});

api.interceptors.response.use(res => res, async (err) => {
    const originalRequest = err.config;

    if (err.response?.status === 401 && !originalRequest._retry){
        originalRequest._retry = true;

        try {
            const res = await axios.post(`${url}/api/auth/refresh`, {}, {withCredentials: true});

            const newAccessToken = res.data.accessToken;

            originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            
            return api(originalRequest);
        } catch (error) {
            console.error("Refresh failed", error);
        }
    }

    return Promise.reject(err);
});

export default api;