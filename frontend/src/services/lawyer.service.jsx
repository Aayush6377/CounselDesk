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

export const scheduleUpdate = async ({startTime, endTime, breakStartTime, breakEndTime, slotDuration, selectedDays}) => {
    try {
        const res = await api.post("/api/lawyer/schedule/update", {startTime, endTime, breakStartTime, breakEndTime, slotDuration, selectedDays});
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const scheduleAvailableToday = async (isAvailableToday) => {
    try {
        const res = await api.put("/api/lawyer/schedule/unavailable/today", { isAvailableToday });
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const scheduleDetails = async () => {
    try {
        const res = await api.get("/api/lawyer/schedule/details");
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}