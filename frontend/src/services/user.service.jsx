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
        console.error(error);
        throw error;
    }
};

export const createCheckoutSession = async (bookingDetails) => {
    try {
        const res = await api.post("/api/user/payment/consultancy/checkout-session", bookingDetails);
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const confirmBooking = async (session_id) => {
    try {
        const res = await api.post("/api/user/payment/confirm-booking", { session_id });
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getUserAppointments = async (page = 1) => {
    try {
        const res = await api.get("/api/user/appointments/list", {
            params: {page}
        });
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const cancelAppointment = async (appointmentId) => {
    try {
        const res = await api.put("/api/user/payment/cancel/appointment",{appointmentId});
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getAppointmentDetails = async (appointmentId) => {
    try {
        const res = await api.get(`/api/user/appointment/details/${appointmentId}`);
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const downloadInvoice = async (appointmentId) => {
    try {
        const res = await api. get(`${api.defaults.baseURL}/api/user/appointment/invoice/${appointmentId}`, {responseType: "blob"});

        const file = new Blob([res.data], {type: "application/pdf"});

        const fileURL = URL.createObjectURL(file);

        const link = document.createElement('a');
        link.href = fileURL;
        link.setAttribute('download', `invoice-${appointmentId}.pdf`);

        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const addReview = async (rating, comment, appointmentId) => {
    try {
        const res = await api.post("/api/user/review/add", {rating, comment, appointmentId});
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const updateReview = async (rating, comment, reviewId) => {
    try {
        const res = await api.put("/api/user/review/update", { rating, comment, reviewId });
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getReviewDetails = async (appointmentId) => {
    try {
        const res = await api.get(`/api/user/review/details/${appointmentId}`);
        return res.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return null; 
        }
        throw error;
    }
}

export const getLawyerReviews = async (lawyerId, page = 1) => {
    try {
        const res = await api.get(`/api/user/reviews/list/${lawyerId}`, { params: { page } });
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getPaymentHistory = async (page = 1) => {
    try {
        const res = await api.get("/api/user/payments/history", { params: { page } });
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
} 

export const getDashboardData = async () => {
    try {
        const res = await api.get("/api/user/dashboard/details");
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}