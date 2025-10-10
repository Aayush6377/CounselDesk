import api from "./axiosInstance";

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

export const createNewAdmin = async ({ name, email }) => {
    try {
        const res = await api.post("/api/admin/create/new-admin", { name, email });
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}