import api from "./axiosInstance";

export const profileSetup = async (lawyerData) => {
    try {
        const res = await api.post("/api/lawyer/profile/setup", lawyerData, {
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

export const profileDetails = async () => {
    try {
        const res = await api.get("/api/lawyer/profile/details");
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const profileUpdate = async (lawyerData) => {
    try {
        const res = await api.put("/api/lawyer/profile/update", lawyerData, {
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