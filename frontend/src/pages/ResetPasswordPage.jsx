import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Lock, CheckCircle } from "lucide-react";
import { authService } from "../services/authService.js";
import Button from "../components/Button.jsx";
import Input from "../components/Input.jsx";
import {
  validatePassword,
  validateConfirmPassword,
} from "../utils/validation.js";
import toast from "react-hot-toast";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const watchPassword = watch("password");

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
    }
  }, [token]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      await authService.resetPassword({
        token,
        password: data.password,
      });
      setResetSuccess(true);
      toast.success("Password reset successfully!");
    } catch (error) {
      console.error("Reset password error:", error);
      if (error.response?.status === 400) {
        setTokenValid(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Invalid token state
  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Lock className="text-red-600" size={32} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Invalid or expired link
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              This password reset link is invalid or has expired. Please request
              a new one.
            </p>
          </div>

          <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
            <div className="space-y-4 text-center">
              <Link to="/forgot-password">
                <Button variant="primary" size="lg" className="w-full">
                  Request new reset link
                </Button>
              </Link>

              <Link to="/login">
                <Button variant="outline" size="lg" className="w-full">
                  Back to login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (resetSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="text-green-600" size={32} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Password reset successful!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Your password has been successfully reset. You can now sign in
              with your new password.
            </p>
          </div>

          <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
            <div className="space-y-4 text-center">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate("/login")}
                className="w-full"
              >
                Sign in to your account
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Reset password form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <Lock className="text-white" size={24} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please enter your new password below.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* New Password */}
            <Input
              label="New Password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your new password"
              leftIcon={<Lock size={20} />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              }
              error={errors.password?.message}
              {...register("password", {
                required: "Password is required",
                validate: (value) => {
                  const validation = validatePassword(value);
                  return validation.isValid || validation.errors[0];
                },
              })}
            />

            {/* Confirm Password */}
            <Input
              label="Confirm New Password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your new password"
              leftIcon={<Lock size={20} />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              }
              error={errors.confirmPassword?.message}
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) => {
                  const validation = validateConfirmPassword(
                    watchPassword,
                    value
                  );
                  return validation.isValid || validation.errors[0];
                },
              })}
            />

            {/* Password Requirements */}
            <div className="text-xs text-gray-500 space-y-1">
              <p className="font-medium">Password must contain:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>At least 8 characters</li>
                <li>One uppercase letter</li>
                <li>One lowercase letter</li>
                <li>One number</li>
                <li>One special character</li>
              </ul>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isLoading}
              className="w-full"
            >
              Reset Password
            </Button>

            {/* Back to login */}
            <div className="text-center">
              <Link
                to="/login"
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Remember your password? Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
