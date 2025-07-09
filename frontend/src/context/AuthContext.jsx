import React, { createContext, useReducer, useEffect } from "react";
import Cookies from "js-cookie";
import authService from "../services/authService.js";
import toast from "react-hot-toast";

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Action types
const AuthActionTypes = {
  LOGIN_START: "LOGIN_START",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGIN_FAILURE: "LOGIN_FAILURE",
  LOGOUT: "LOGOUT",
  SET_USER: "SET_USER",
  SET_LOADING: "SET_LOADING",
  CLEAR_ERROR: "CLEAR_ERROR",
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AuthActionTypes.LOGIN_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case AuthActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case AuthActionTypes.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload.error,
      };
    case AuthActionTypes.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case AuthActionTypes.SET_USER:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: !!action.payload.user,
        isLoading: false,
      };
    case AuthActionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload.isLoading,
      };
    case AuthActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get("accessToken");
      if (token) {
        try {
          const response = await authService.getCurrentUser();
          dispatch({
            type: AuthActionTypes.SET_USER,
            payload: { user: response.data.user },
          });
        } catch (error) {
          console.error("Auth check error:", error);
          // Token is invalid, remove it
          Cookies.remove("accessToken");
          Cookies.remove("refreshToken");
          dispatch({
            type: AuthActionTypes.SET_LOADING,
            payload: { isLoading: false },
          });
        }
      } else {
        dispatch({
          type: AuthActionTypes.SET_LOADING,
          payload: { isLoading: false },
        });
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      dispatch({ type: AuthActionTypes.LOGIN_START });

      const response = await authService.login(credentials);
      const { user, accessToken, refreshToken } = response.data;

      // Store tokens in cookies
      Cookies.set("accessToken", accessToken, { expires: 1 }); // 1 day
      Cookies.set("refreshToken", refreshToken, { expires: 7 }); // 7 days

      dispatch({
        type: AuthActionTypes.LOGIN_SUCCESS,
        payload: { user },
      });

      toast.success("Login successful!");
      return response;
    } catch (error) {
      dispatch({
        type: AuthActionTypes.LOGIN_FAILURE,
        payload: { error: error.response?.data?.message || "Login failed" },
      });
      throw error;
    }
  };

  // Register function
  const register = async (formData) => {
    try {
      dispatch({ type: AuthActionTypes.LOGIN_START });

      const response = await authService.register(formData);

      dispatch({
        type: AuthActionTypes.SET_LOADING,
        payload: { isLoading: false },
      });

      toast.success(
        "Registration successful! Please check your email for verification."
      );
      return response;
    } catch (error) {
      dispatch({
        type: AuthActionTypes.LOGIN_FAILURE,
        payload: {
          error: error.response?.data?.message || "Registration failed",
        },
      });
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear tokens and state regardless of API call result
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      dispatch({ type: AuthActionTypes.LOGOUT });
      toast.success("Logged out successfully");
    }
  };

  // Update user data
  const updateUser = (userData) => {
    dispatch({
      type: AuthActionTypes.SET_USER,
      payload: { user: userData },
    });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: AuthActionTypes.CLEAR_ERROR });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
