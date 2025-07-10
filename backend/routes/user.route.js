import { Router } from "express";
import {
  registerUser,
  loginUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getUsers,
  getUserProfile,
  updateProfile,
  deleteUser,
  refreshToken,
  logout,
  getCurrentUser,
} from "../controller/user.controller.js";
import {
  validateRegistration,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validateUpdateProfile,
  validatePagination,
} from "../middleware/validation.js";
import {
  authenticateToken,
  requireEmailVerification,
  requireAdmin,
} from "../middleware/auth.js";
import { uploadProfileImage, handleMulterError } from "../middleware/upload.js";
import {
  loginLimiter,
  passwordResetLimiter,
} from "../middleware/rateLimiter.js";
import upload from "../config/multer.js";

const router = Router();

// Public routes
router.post(
  "/register",
  // uploadProfileImage,
  // handleMulterError,
  upload.single("profileImage"),
  validateRegistration,
  registerUser
);
router.post("/login", loginLimiter, validateLogin, loginUser);
router.get("/verify-email", verifyEmail);
router.post(
  "/forgot-password",
  passwordResetLimiter,
  validateForgotPassword,
  forgotPassword
);
router.post("/reset-password", validateResetPassword, resetPassword);
router.post("/refresh-token", refreshToken);

// Protected routes
router.use(authenticateToken);
router.get("/me", getCurrentUser);
router.post("/logout", logout);
router.put(
  "/profile",
  // uploadProfileImage,
  // handleMulterError,
  upload.single("profileImage"),
  validateUpdateProfile,
  updateProfile
);

// Email verified required routes
router.use(requireEmailVerification);
router.get("/", validatePagination, getUsers);
router.get("/:id", getUserProfile);

// Admin only routes
router.delete("/:id", requireAdmin, deleteUser);

export default router;
