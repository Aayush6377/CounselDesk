import api from "./axiosInstance";

export const getLawyersList = async (address) => {
    try {
        const res = await api.get("/api/landing/lawyers/list",{
            params: {
                address: JSON.stringify(address)
            }
        });
        return res.data.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getLawyerDetails = async (lawyerId) => {
    try {
        const res = await api.get(`/api/landing/lawyer/profile/${lawyerId}`);
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}