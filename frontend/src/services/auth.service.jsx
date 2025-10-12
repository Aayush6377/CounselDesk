import api from "./axiosInstance";

export const googleAuth = async (credentialResponse, role) => {
    const idToken = credentialResponse.credential;
    try {
        const res = await api.post("/api/auth/google", {
            token: idToken,
            role
        });
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const localSignup = async ({ name, email, password, confirmPassword ,role }) => {
    try {
        const res = await api.post("/api/auth/local/signup", {name, email, password, confirmPassword, role});
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const localLogin = async ({email, password}) => {
    try {
        const res = await api.post("/api/auth/local/login", {email, password});
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const resetPassword = async ({email, password, confirmPassword}) => {
    try {
        const res = await api.post("/api/auth/local/resetPassword", {email, password, confirmPassword});
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const logoutUser = async () => {
    try {
        const res = api.post("/api/auth/logout");
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const deleteAccount = () => {
    try {
        const res = api.delete("/api/auth/delete");
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const refreshAccessToken = async () => {
    try {
        const res = await api.post("/api/auth/refresh", {}, { withCredentials: true });
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const sendOtp = async (email, useCase = "signup") => {
    try {
        const res = await api.post("/api/auth/otp/send", {email,useCase});
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const verifyOtp = async (otp, token) => {
    try {
        const res = await api.post("/api/auth/otp/verify", {otp, token});
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}