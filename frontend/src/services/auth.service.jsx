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
        console.error("Authentication failed", error.response?.data?.message || error.message);
        return null;
    }
}

export const localSignup = async ({ name, email, password, confirmPassword ,role }) => {
    try {
        const res = await api.post("/api/auth/local/signup", {name, email, password, confirmPassword, role});
        return res.data;
    } catch (error) {
        return error.response.data;
    }
}

export const localLogin = async ({email, password}) => {
    try {
        const res = await api.post("/api/auth/local/login", {email, password});
        return res.data;
    } catch (error) {
        return error.response.data;
    }
}

export const resetPassword = async ({email, password, confirmPassword}) => {
    try {
        const res = await api.post("/api/auth/local/resetPassword", {email, password, confirmPassword});
        return res.data;
    } catch (error) {
        return error.response.data;
    }
}

export const logoutUser = async () => {
    try {
        const res = api.post("/api/auth/logout");
        return res.data;
    } catch (error) {
        console.error("Logout failed:", error.response?.data?.message || error.message);
        return { success: false };
    }
}

export const refreshAccessToken = async () => {
    try {
        const res = await api.get("/api/auth/refresh");
        return res.data;
    } catch (error) {
        console.error("Failed to refresh token:", error.response?.data?.message || error.message);
        return { success: false };
    }
}

export const sendOtp = async (email, useCase = "signup") => {
    try {
        const res = await api.post("/api/auth/otp/send", {email,useCase});
        return res.data;
    } catch (error) {
        return error.response?.data?.message || error.message;
    }
}

export const verifyOtp = async (otp, token) => {
    try {
        const res = await api.post("/api/auth/otp/verify", {otp, token});
        return res.data;
    } catch (error) {
        return error.response?.data?.message || error.message;
    }
}