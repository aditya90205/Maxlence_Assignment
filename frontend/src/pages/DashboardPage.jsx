import React, { useState, useEffect } from "react";
import { Users, Search, Plus, Trash2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth.js";
import { userService } from "../services/userService.js";
import UserCard from "../components/UserCard.jsx";
import SearchBar from "../components/SearchBar.jsx";
import Pagination from "../components/Pagination.jsx";
import Loading from "../components/Loading.jsx";
import Button from "../components/Button.jsx";
import Modal from "../components/Modal.jsx";
import toast from "react-hot-toast";

const DashboardPage = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const usersPerPage = 12;

  const fetchUsers = async (page = 1, search = "") => {
    try {
      setLoading(true);
      const response = await userService.getUsers(page, usersPerPage, search);
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
      setTotalUsers(response.data.totalUsers);
      setCurrentPage(response.data.currentPage);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleViewProfile = (user) => {
    setSelectedUser(user);
    setShowProfileModal(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;

    try {
      setDeleteLoading(true);
      await userService.deleteUser(selectedUser.id);
      toast.success("User deleted successfully");
      setShowDeleteModal(false);
      setSelectedUser(null);
      fetchUsers(currentPage, searchTerm);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    } finally {
      setDeleteLoading(false);
    }
  };

  const UserProfileModal = ({ user, isOpen, onClose }) => {
    if (!user) return null;

    const profileImageUrl = user.profileImage?.startsWith("http")
      ? user.profileImage
      : user.profileImage
      ? `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}${
          user.profileImage
        }`
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
          `${user.firstName} ${user.lastName}`
        )}&background=random&color=fff&size=200`;

    return (
      <Modal isOpen={isOpen} onClose={onClose} title="User Profile" size="lg">
        <div className="space-y-6">
          {/* Profile Image and Basic Info */}
          <div className="flex items-center space-x-4">
            <img
              src={profileImageUrl}
              alt={`${user.firstName} ${user.lastName}`}
              className="w-20 h-20 rounded-full object-cover border-4 border-gray-200"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-gray-600">{user.email}</p>
              <div className="flex items-center space-x-2 mt-2">
                <span
                  className={`px-2 py-1 text-xs rounded-full font-medium ${
                    user.role === "admin"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {user.role}
                </span>
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
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                User ID
              </label>
              <p className="mt-1 text-sm text-gray-900 font-mono">{user.id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Account Created
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            {user.lastLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Last Login
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(user.lastLogin).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Last Updated
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(user.updatedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    );
  };

  if (loading && currentPage === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" text="Loading users..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Users className="mr-3" size={32} />
              Users Dashboard
            </h1>
            <p className="mt-2 text-gray-600">
              Manage and view all registered users
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search users by name or email..."
          className="w-full sm:max-w-md"
        />
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>Total Users: {totalUsers}</span>
        </div>
      </div>

      {/* Users Grid */}
      {users.length === 0 ? (
        <div className="text-center py-12">
          <Users size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No users found
          </h3>
          <p className="text-gray-500">
            {searchTerm
              ? "Try adjusting your search criteria"
              : "No users have been registered yet"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {users.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              currentUser={currentUser}
              onViewProfile={handleViewProfile}
              onDeleteUser={handleDeleteUser}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Delete"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-700">
                Are you sure you want to delete{" "}
                <span className="font-medium">
                  {selectedUser?.firstName} {selectedUser?.lastName}
                </span>
                ? This action cannot be undone.
              </p>
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
              loading={deleteLoading}
            >
              Delete User
            </Button>
          </div>
        </div>
      </Modal>

      {/* User Profile Modal */}
      <UserProfileModal
        user={selectedUser}
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </div>
  );
};

export default DashboardPage;
