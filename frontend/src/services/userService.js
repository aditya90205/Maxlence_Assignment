import api from "./api.js";

export const userService = {
  // Get all users with pagination and search
  getUsers: async (page = 1, limit = 10, search = "") => {
    const response = await api.get("/user", {
      params: { page, limit, search },
    });
    return response.data;
  },

  // Get user by ID
  getUserById: async (id) => {
    const response = await api.get(`/user/${id}`);
    return response.data;
  },

  // Update user profile
  updateProfile: async (formData) => {
    console.log("Updating profile with formData:", formData);
    
    const response = await api.put("/user/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Profile update response:", response);
    
    return response.data;
  },

  // Delete user (admin only)
  deleteUser: async (id) => {
    const response = await api.delete(`/user/${id}`);
    return response.data;
  },
};

export default userService;
