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