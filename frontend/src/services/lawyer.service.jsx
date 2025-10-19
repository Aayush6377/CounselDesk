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

export const getDashboardData = async () => {
    try {
        const res = await api.get("/api/lawyer/dashboard/details");
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

export const getLawyerAppointments = async (page = 1) => {
    try {
        const res = await api.get("/api/lawyer/appointments/list",{
            params: {page}
        });
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getAppointmentDetails = async (appointmentId) => {
    try {
        const res = await api.get(`/api/lawyer/appointment/details/${appointmentId}`);
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getReviewStats = async () => {
    try {
        const res = await api.get("/api/lawyer/reviews/stats");
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getLawyerReviewsList = async (page = 1, sortBy = 'newest') => {
    try {
        const res = await api.get('/api/lawyer/reviews/list', {
            params: { page, sortBy }
        });
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getPlansData = async () => {
    try {
        const res = await api.get("/api/lawyer/subscriptions/plans/details");
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const createSubscriptionCheckoutSession = async (planId) => {
    try {
        const res = await api.post("/api/lawyer/payment/subscription/checkout-session",{ planId });
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const confirmSubscriptionPurchase = async (session_id) => {
    try {
        const res = await api.post("/api/lawyer/payment/confirm-purchase", { session_id });
        return  res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const cancelSubscription = async () => {
    try {
        const res = await api.put("/api/lawyer/payment/cancel/subscription");
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getSubscriptionDetails = async () => {
    try {
        const res = await api.get("/api/lawyer/subscription/curent-plan/details");
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getEarningsData = async (page = 1) => {
    try {
        const res = await api.get("/api/lawyer/earning/details", {
            params: { page }
        });
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getLawyerQuestionsList = async ({ pageParam = 1, queryKey }) => {
    const [_key, filters] = queryKey;
    try {
        const res = await api.get("/api/lawyer/community/questions/list", {
            params: { page: pageParam, ...filters }
        });
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const addAnswer = async ({ content, questionId }) => {
    try {
        const res = await api.post("/api/lawyer/community/answer/add", { content, questionId });
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const updateAnswer = async ({ content, answerId }) => {
    try {
        const res = await api.put("/api/lawyer/community/answer/update",{ content, answerId });
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const deleteAnswer = async (answerId) => {
    try {
        const res = await api.delete(`/api/lawyer/community/answer/delete/${answerId}`);
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}