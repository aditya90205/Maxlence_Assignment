import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut, User, Users, Menu, X, Crown } from "lucide-react";
import { useAuth } from "../hooks/useAuth.js";
import { generateAvatarUrl } from "../utils/helpers.js";
import Button from "./Button.jsx";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const profileImageUrl = user?.profileImage?.startsWith("http")
    ? user.profileImage
    : user?.profileImage
    ? `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}${
        user.profileImage
      }`
    : generateAvatarUrl(`${user?.firstName} ${user?.lastName}`);

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">U</span>
              </div>
              <span className="text-xl font-bold text-gray-900">UserHub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {user && (
              <>
                <Link
                  to="/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActivePath("/dashboard")
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  <Users size={16} className="inline mr-1" />
                  Users
                </Link>
                <Link
                  to="/profile"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActivePath("/profile")
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  <User size={16} className="inline mr-1" />
                  My Profile
                </Link>
              </>
            )}
          </div>

          {/* Right side - User menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* User info - Desktop */}
                <div className="hidden md:flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={profileImageUrl}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                      onError={(e) => {
                        e.target.src = generateAvatarUrl(
                          `${user.firstName} ${user.lastName}`
                        );
                      }}
                    />
                    {user.role === "admin" && (
                      <div className="absolute -top-1 -right-1 bg-yellow-500 text-white rounded-full p-0.5">
                        <Crown size={10} />
                      </div>
                    )}
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-gray-500 capitalize">{user.role}</p>
                  </div>
                </div>

                {/* Logout button - Desktop */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="hidden md:flex"
                >
                  <LogOut size={16} className="mr-1" />
                  Logout
                </Button>
              </>
            ) : (
              /* Guest buttons */
              <div className="hidden md:flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Register
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200">
              {user ? (
                <>
                  {/* User info - Mobile */}
                  <div className="flex items-center space-x-3 px-3 py-2">
                    <div className="relative">
                      <img
                        src={profileImageUrl}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                        onError={(e) => {
                          e.target.src = generateAvatarUrl(
                            `${user.firstName} ${user.lastName}`
                          );
                        }}
                      />
                      {user.role === "admin" && (
                        <div className="absolute -top-1 -right-1 bg-yellow-500 text-white rounded-full p-0.5">
                          <Crown size={12} />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-sm text-gray-500 capitalize">
                        {user.role}
                      </p>
                    </div>
                  </div>

                  <Link
                    to="/dashboard"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Users size={16} className="inline mr-2" />
                    Users
                  </Link>
                  <Link
                    to="/profile"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User size={16} className="inline mr-2" />
                    My Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  >
                    <LogOut size={16} className="inline mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
