import api from "./axiosInstance";

export const profileUpdate = async (userData) => {
    try {
        const res = await api.put("/api/user/profile/update", userData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}