import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useAuth } from "../hooks/useAuth.js";
import Loading from "../components/Loading.jsx";
import toast from "react-hot-toast";

const AuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { updateUser } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const accessToken = searchParams.get("accessToken");
      const refreshToken = searchParams.get("refreshToken");
      const error = searchParams.get("error");

      if (error) {
        console.error("OAuth error:", error);
        if (error === "oauth_failed") {
          toast.error("Google authentication failed. Please try again.");
        } else {
          toast.error("Authentication error occurred.");
        }
        navigate("/login");
        return;
      }

      if (accessToken && refreshToken) {
        try {
          // Store tokens
          Cookies.set("accessToken", accessToken, { expires: 1 }); // 1 day
          Cookies.set("refreshToken", refreshToken, { expires: 7 }); // 7 days

          // Get user data
          const response = await fetch(
            `${
              import.meta.env.VITE_API_BASE_URL ||
              "http://localhost:5000/api/v1"
            }/user/me`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          if (response.ok) {
            const userData = await response.json();
            updateUser(userData.data.user);
            toast.success("Successfully signed in with Google!");
            navigate("/dashboard");
          } else {
            throw new Error("Failed to get user data");
          }
        } catch (error) {
          console.error("Error processing OAuth callback:", error);
          toast.error("Authentication failed. Please try again.");
          navigate("/login");
        }
      } else {
        console.error("Missing tokens in callback");
        toast.error("Authentication failed. Please try again.");
        navigate("/login");
      }
    };

    handleCallback();
  }, [searchParams, navigate, updateUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loading size="xl" text="Completing sign in..." />
        <p className="mt-4 text-sm text-gray-600">
          Please wait while we set up your account.
        </p>
      </div>
    </div>
  );
};

export default AuthCallbackPage;
