import api from "./axiosInstance";

export const getMeetingLink = async (appointmentId) => {
    try {
        const res = await api.get(`/api/jitsi/meeting/${appointmentId}`);
        return res.data;
    } catch (error) {
        console.error("Failed to generate Jitsi token:", error);
        throw error;
    }
};