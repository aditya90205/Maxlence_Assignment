import React from "react";
import { Mail, Calendar, Crown, Trash2, Eye } from "lucide-react";
import { formatDate, generateAvatarUrl } from "../utils/helpers.js";
import Button from "./Button.jsx";

const UserCard = ({
  user,
  currentUser,
  onViewProfile,
  onDeleteUser,
  className = "",
}) => {
  const isCurrentUser = currentUser?.id === user.id;
  const canDelete = currentUser?.role === "admin" && !isCurrentUser;

  const profileImageUrl = user.profileImage?.startsWith("http")
    ? user.profileImage
    : user.profileImage
    ? `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}${
        user.profileImage
      }`
    : generateAvatarUrl(
        user.getFullName?.() || `${user.firstName} ${user.lastName}`
      );

  return (
    <div
      className={`bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow ${className}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={profileImageUrl}
              alt={`${user.firstName} ${user.lastName}`}
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
              onError={(e) => {
                e.target.src = generateAvatarUrl(
                  `${user.firstName} ${user.lastName}`
                );
              }}
            />
            {user.role === "admin" && (
              <div className="absolute -top-1 -right-1 bg-yellow-500 text-white rounded-full p-1">
                <Crown size={12} />
              </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {user.firstName} {user.lastName}
              {isCurrentUser && (
                <span className="ml-2 text-sm font-normal text-blue-600">
                  (You)
                </span>
              )}
            </h3>
            <div className="flex items-center text-sm text-gray-500">
              <Mail size={14} className="mr-1" />
              {user.email}
            </div>
          </div>
        </div>

        {/* Status indicators */}
        <div className="flex flex-col items-end space-y-1">
          <span
            className={`px-2 py-1 text-xs rounded-full font-medium ${
              user.isEmailVerified
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {user.isEmailVerified ? "Verified" : "Unverified"}
          </span>
          <span
            className={`px-2 py-1 text-xs rounded-full font-medium ${
              user.isActive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {user.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      {/* User info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <span className="font-medium mr-2">Role:</span>
          <span
            className={`capitalize px-2 py-1 rounded text-xs font-medium ${
              user.role === "admin"
                ? "bg-purple-100 text-purple-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {user.role}
          </span>
        </div>

        {user.lastLogin && (
          <div className="flex items-center text-sm text-gray-600">
            <Calendar size={14} className="mr-1" />
            <span className="font-medium mr-2">Last login:</span>
            {formatDate(user.lastLogin)}
          </div>
        )}

        <div className="flex items-center text-sm text-gray-600">
          <Calendar size={14} className="mr-1" />
          <span className="font-medium mr-2">Joined:</span>
          {formatDate(user.createdAt)}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
        <Button variant="outline" size="sm" onClick={() => onViewProfile(user)}>
          <Eye size={16} className="mr-1" />
          View Profile
        </Button>

        {canDelete && (
          <Button variant="danger" size="sm" onClick={() => onDeleteUser(user)}>
            <Trash2 size={16} className="mr-1" />
            Delete
          </Button>
        )}
      </div>
    </div>
  );
};

export default UserCard;
