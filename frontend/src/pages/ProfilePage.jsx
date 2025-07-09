import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { User, Mail, Calendar, Save, Edit3 } from "lucide-react";
import { useAuth } from "../hooks/useAuth.js";
import { userService } from "../services/userService.js";
import Button from "../components/Button.jsx";
import Input from "../components/Input.jsx";
import ImageUpload from "../components/ImageUpload.jsx";
import { formatDate, generateAvatarUrl } from "../utils/helpers.js";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imageError, setImageError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
    },
  });

  const profileImageUrl = user?.profileImage?.startsWith("http")
    ? user.profileImage
    : user?.profileImage
    ? `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}${
        user.profileImage
      }`
    : generateAvatarUrl(`${user?.firstName} ${user?.lastName}`);

  const handleImageSelect = (file, error) => {
    setProfileImage(file);
    setImageError(error);
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      // Create FormData for file upload
      const formData = new FormData();

      // Only append changed fields
      if (data.firstName !== user.firstName) {
        formData.append("firstName", data.firstName);
      }
      if (data.lastName !== user.lastName) {
        formData.append("lastName", data.lastName);
      }
      if (data.email !== user.email) {
        formData.append("email", data.email);
      }

      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      const response = await userService.updateProfile(formData);
      updateUser(response.data.user);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
      setProfileImage(null);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setProfileImage(null);
    setImageError(null);
    reset({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
    });
  };

  const AccountStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-blue-50 rounded-lg p-6">
        <div className="flex items-center">
          <div className="p-2 bg-blue-500 rounded-lg">
            <User className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">
              Account Status
            </h3>
            <p
              className={`text-sm ${
                user?.isActive ? "text-green-600" : "text-red-600"
              }`}
            >
              {user?.isActive ? "Active" : "Inactive"}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-green-50 rounded-lg p-6">
        <div className="flex items-center">
          <div className="p-2 bg-green-500 rounded-lg">
            <Mail className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">Email Status</h3>
            <p
              className={`text-sm ${
                user?.isEmailVerified ? "text-green-600" : "text-yellow-600"
              }`}
            >
              {user?.isEmailVerified ? "Verified" : "Unverified"}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-purple-50 rounded-lg p-6">
        <div className="flex items-center">
          <div className="p-2 bg-purple-500 rounded-lg">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">Member Since</h3>
            <p className="text-sm text-gray-600">
              {user?.createdAt ? formatDate(user.createdAt) : "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="mt-2 text-gray-600">
              Manage your account settings and personal information
            </p>
          </div>
          {!isEditing && (
            <Button variant="primary" onClick={() => setIsEditing(true)}>
              <Edit3 size={16} className="mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Account Stats */}
      <AccountStats />

      {/* Profile Form */}
      <div className="bg-white shadow-lg rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Profile Information
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Update your personal information and profile picture
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Profile Image */}
          <div className="flex flex-col items-center space-y-4">
            {isEditing ? (
              <ImageUpload
                onImageSelect={handleImageSelect}
                currentImage={profileImageUrl}
                label="Profile Picture"
                error={imageError}
              />
            ) : (
              <div className="text-center">
                <img
                  src={profileImageUrl}
                  alt={`${user?.firstName} ${user?.lastName}`}
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 mx-auto"
                  onError={(e) => {
                    e.target.src = generateAvatarUrl(
                      `${user?.firstName} ${user?.lastName}`
                    );
                  }}
                />
                <h3 className="mt-4 text-xl font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </h3>
                <p className="text-gray-500">{user?.email}</p>
                <span
                  className={`inline-block mt-2 px-3 py-1 text-sm rounded-full font-medium ${
                    user?.role === "admin"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {user?.role}
                </span>
              </div>
            )}
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="First Name"
              type="text"
              placeholder="Enter your first name"
              leftIcon={<User size={20} />}
              disabled={!isEditing}
              error={errors.firstName?.message}
              {...register("firstName", {
                required: "First name is required",
                minLength: {
                  value: 2,
                  message: "First name must be at least 2 characters",
                },
                maxLength: {
                  value: 50,
                  message: "First name must not exceed 50 characters",
                },
                pattern: {
                  value: /^[a-zA-Z\s]+$/,
                  message: "First name must contain only letters and spaces",
                },
              })}
            />

            <Input
              label="Last Name"
              type="text"
              placeholder="Enter your last name"
              leftIcon={<User size={20} />}
              disabled={!isEditing}
              error={errors.lastName?.message}
              {...register("lastName", {
                required: "Last name is required",
                minLength: {
                  value: 2,
                  message: "Last name must be at least 2 characters",
                },
                maxLength: {
                  value: 50,
                  message: "Last name must not exceed 50 characters",
                },
                pattern: {
                  value: /^[a-zA-Z\s]+$/,
                  message: "Last name must contain only letters and spaces",
                },
              })}
            />
          </div>

          <Input
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            leftIcon={<Mail size={20} />}
            disabled={!isEditing}
            error={errors.email?.message}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email address",
              },
            })}
          />

          {/* Account Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Created
              </label>
              <div className="mt-1 p-3 bg-gray-50 border border-gray-300 rounded-lg">
                <p className="text-sm text-gray-900">
                  {user?.createdAt ? formatDate(user.createdAt) : "N/A"}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Login
              </label>
              <div className="mt-1 p-3 bg-gray-50 border border-gray-300 rounded-lg">
                <p className="text-sm text-gray-900">
                  {user?.lastLogin ? formatDate(user.lastLogin) : "Never"}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={isLoading}
                disabled={!!imageError}
              >
                <Save size={16} className="mr-2" />
                Save Changes
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
