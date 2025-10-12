import api from "./axiosInstance";

export const getDashboardData = async () => {
    try {
        const res = await api.get("/api/admin/dashboard/details");
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getUserData = async (page = 1, role = "", search = "") => {
    try {
        const res = await api.get("/api/admin/users/details", { params: { page, role, search } });
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const updateUserStatus = async (status, userId) => {
    try {
        if (!['active', 'suspended'].includes(status)){
            throw new Error("Invalid status provided.");
        }
        const res = await api.put("/api/admin/user/update/status", { status, userId });
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const deleteUserAccount = async (userId) => {
    try {
        const res = await api.delete(`/api/admin/user/delete/${userId}`);
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const createNewAdmin = async ({ name, email }) => {
    try {
        const res = await api.post("/api/admin/create/new-admin", { name, email });
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getLawyersData = async (page = 1) => {
    try {
        const res = await api.get("/api/admin/lawyers/list", { params: { page } });
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getLawyerProfile = async (lawyerId) => {
    try {
        const res = await api.get(`/api/admin/lawyer/profile/${lawyerId}`);
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const updateVerificationStatus = async ({ lawyerId, status, rejectReason }) => {
    try {
        const res = await api.put("/api/admin/lawyer/update/verificationStatus",{ lawyerId, status, rejectReason });
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getContactSubmissionList = async (page = 1) => {
    try {
        const res = await api.get("/api/admin/contact/list", { params: { page } });
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getContactDetails = async (contactId) => {
    try {
        const res = await api.get(`api/admin/contact/detail/${contactId}`);
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const removeContactSubmission = async (contactId) => {
    try {
        const res = await api.delete(`api/admin/contact/delete/${contactId}`);
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}