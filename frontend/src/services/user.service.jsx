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

export const getLawyersList = async (address, search="", specialization="", rating="0", page=1) => {
    try {
        const res = await api.get("/api/user/lawyers/list",{
            params: {
                search, specialization, rating, page, address: JSON.stringify(address)
            }
        });
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getLawyerDetails = async (lawyerId) => {
    try {
        const res = await api.get(`/api/user/lawyer/profile/${lawyerId}`);
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getLawyerTimeSlots = async (lawyerId) => {
    try {
        const res = await api.get(`/api/user/lawyer/timeSlots/${lawyerId}`);
        return res.data;
    } catch (error) {
        console.error("Failed to fetch lawyer time slots:", error);
        throw error;
    }
};

export const createCheckoutSession = async (bookingDetails) => {
    try {
        const res = await api.post("/api/user/payment/consultancy/checkout-session", bookingDetails);
        return res.data;
    } catch (error) {
        console.error("Failed to fetch lawyer time slots:", error);
        throw error;
    }
}

export const confirmBooking = async (session_id) => {
    try {
        const res = await api.post("/api/user/payment/confirm-booking", { session_id });
        return res.data;
    } catch (error) {
        console.error("Failed to fetch lawyer time slots:", error);
        throw error;
    }
}