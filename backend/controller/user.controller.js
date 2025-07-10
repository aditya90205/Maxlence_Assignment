import { UserService } from "../service/userService.js";

export const registerUser = async (req, res) => {
  try {
    // const profileImagePath = req.file
    //   ? `/uploads/profiles/${req.file.filename}`
    //   : null;

    let profileImage = null;
    if (req.file && req.file.path) {
      profileImage = req.file.path;
    }
    const user = await UserService.createUser(req.body, profileImage);

    res.status(201).json({
      success: true,
      message:
        "User registered successfully. Please check your email for verification.",
      data: { userId: user.id, email: user.email, user },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await UserService.loginUser(email, password);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    console.log("Email verification request received with token:", token);
    console.log("Token length:", token?.length);
    console.log("Token type:", typeof token);

    // URL decode the token in case it was encoded
    const decodedToken = decodeURIComponent(token);
    console.log("Decoded token:", decodedToken);
    console.log("Decoded token length:", decodedToken?.length);

    const user = await UserService.verifyEmail(decodedToken);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      data: { user },
    });
  } catch (error) {
    console.error("Email verification controller error:", error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await UserService.forgotPassword(email);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const result = await UserService.resetPassword(token, password);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const result = await UserService.getUsers(page, limit, search);

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id || req.user.id;
    const user = await UserService.getUserById(userId);

    res.status(200).json({
      success: true,
      message: "User profile retrieved successfully",
      data: { user },
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    // const profileImagePath = req.file
    //   ? `/uploads/profiles/${req.file.filename}`
    //   : null;
    // const user = await UserService.updateProfile(
    //   userId,
    //   req.body,
    //   profileImagePath
    // );
    let profileImagePath = null;
    if (req.file && req.file.path) {
      // Remove old image if exists and is a Cloudinary image
      const user = await UserService.getUserById(userId);
      if (user.profileImage && user.profileImage.includes("cloudinary.com")) {
        // Extract public_id from URL
        const urlParts = user.profileImage.split("/");
        const fileName = urlParts[urlParts.length - 1];
        const publicId = `maxlence_users/${fileName.split(".")[0]}`;
        await cloudinary.uploader.destroy(publicId);
      }
      profileImagePath = req.file.path;
    }

    const user = await UserService.updateProfile(
      userId,
      req.body,
      profileImagePath
    );
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: { user },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await UserService.deleteUser(id);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const result = await UserService.refreshAccessToken(refreshToken);

    res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      data: result,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await UserService.logout(userId);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Current user retrieved successfully",
      data: { user: req.user },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
