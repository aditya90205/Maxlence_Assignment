import api from "./api.js";

export const authService = {
  // Register user
  register: async (formData) => {
    const response = await api.post("/user/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post("/user/login", credentials);
    return response.data;
  },

  // Verify email
  verifyEmail: async (token) => {
    const response = await api.get(`/user/verify-email?token=${token}`);
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await api.post("/user/forgot-password", { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (data) => {
    const response = await api.post("/user/reset-password", data);
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await api.post("/user/logout");
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get("/user/me");
    return response.data;
  },

  // Refresh token
  refreshToken: async (refreshToken) => {
    const response = await api.post("/user/refresh-token", { refreshToken });
    return response.data;
  },

  // Google OAuth
  googleAuth: () => {
    window.location.href = `${
      import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1"
    }/auth/google`;
  },
};

export default authService;
