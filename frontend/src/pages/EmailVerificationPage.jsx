// import React, { useState, useEffect } from "react";
// import { Link, useSearchParams, useNavigate } from "react-router-dom";
// import { CheckCircle, XCircle, Mail } from "lucide-react";
// import { authService } from "../services/authService.js";
// import Button from "../components/Button.jsx";
// import Loading from "../components/Loading.jsx";

// const EmailVerificationPage = () => {
//   const [searchParams] = useSearchParams();
//   const [verificationStatus, setVerificationStatus] = useState("verifying"); // 'verifying', 'success', 'error'
//   const [errorMessage, setErrorMessage] = useState("");
//   const navigate = useNavigate();

//   const token = searchParams.get("token");

//   console.log("Email verification token:", token);

//   useEffect(() => {
//     const verifyEmail = async () => {
//       if (!token) {
//         setVerificationStatus("error");
//         setErrorMessage("Invalid verification link");
//         return;
//       }

//       try {
//         console.log("Making verification request with token:", token);
//         console.log("Token length:", token?.length);
//         const result = await authService.verifyEmail(token);
//         console.log("Verification response:", result);
//         setVerificationStatus("success");
//       } catch (error) {
//         console.error("Verification error:", error);
//         console.error("Error response:", error.response);
//         console.error("Error status:", error.response?.status);
//         setVerificationStatus("error");

//         // Better error handling
//         if (error.response?.status === 400) {
//           const message =
//             error.response?.data?.message || "Email verification failed";
//           setErrorMessage(message);
//         } else if (error.response?.status === 404) {
//           setErrorMessage("Verification endpoint not found");
//         } else if (error.response?.status >= 500) {
//           setErrorMessage("Server error occurred. Please try again later.");
//         } else if (error.code === "NETWORK_ERROR") {
//           setErrorMessage("Network error. Please check your connection.");
//         } else {
//           setErrorMessage(
//             error.response?.data?.message ||
//               error.message ||
//               "Email verification failed"
//           );
//         }
//       }
//     };

//     verifyEmail();
//   }, [token]);

//   // Loading state
//   if (verificationStatus === "verifying") {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <Loading size="xl" text="Verifying your email..." />
//         </div>
//       </div>
//     );
//   }

//   // Success state
//   if (verificationStatus === "success") {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-md w-full space-y-8">
//           <div className="text-center">
//             <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
//               <CheckCircle className="text-green-600" size={32} />
//             </div>
//             <h2 className="text-3xl font-bold text-gray-900">
//               Email verified!
//             </h2>
//             <p className="mt-2 text-sm text-gray-600">
//               Your email address has been successfully verified. You can now
//               access all features of your account.
//             </p>
//           </div>

//           <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
//             <div className="space-y-4 text-center">
//               <div className="space-y-3">
//                 <h3 className="text-lg font-medium text-gray-900">
//                   Welcome to UserHub!
//                 </h3>
//                 <p className="text-sm text-gray-600">
//                   Your account is now fully activated and ready to use.
//                 </p>
//               </div>

//               <div className="space-y-3 pt-4">
//                 <Button
//                   variant="primary"
//                   size="lg"
//                   onClick={() => navigate("/login")}
//                   className="w-full"
//                 >
//                   Sign in to your account
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Error state
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         <div className="text-center">
//           <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
//             <XCircle className="text-red-600" size={32} />
//           </div>
//           <h2 className="text-3xl font-bold text-gray-900">
//             Verification failed
//           </h2>
//           <p className="mt-2 text-sm text-gray-600">{errorMessage}</p>
//         </div>

//         <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
//           <div className="space-y-4 text-center">
//             <div className="space-y-3">
//               <h3 className="text-lg font-medium text-gray-900">
//                 What happened?
//               </h3>
//               <div className="text-sm text-gray-600 space-y-2">
//                 <p>This verification link may have:</p>
//                 <ul className="text-left space-y-1">
//                   <li>• Expired (links are valid for 24 hours)</li>
//                   <li>• Already been used successfully</li>
//                   <li>• Been corrupted during forwarding</li>
//                   <li>• Been generated for a different email</li>
//                 </ul>
//               </div>
//             </div>

//             <div className="space-y-3 pt-4">
//               {errorMessage?.includes("already been used") ? (
//                 <Link to="/login">
//                   <Button variant="primary" size="lg" className="w-full">
//                     Sign in to your account
//                   </Button>
//                 </Link>
//               ) : (
//                 <Link to="/register">
//                   <Button variant="primary" size="lg" className="w-full">
//                     <Mail size={16} className="mr-2" />
//                     Get new verification link
//                   </Button>
//                 </Link>
//               )}

//               <Link to="/login">
//                 <Button variant="outline" size="lg" className="w-full">
//                   Back to login
//                 </Button>
//               </Link>
//             </div>
//           </div>
//         </div>

//         {/* Additional Help */}
//         <div className="text-center">
//           <p className="text-xs text-gray-500">
//             Still having issues? Contact our{" "}
//             <a href="#" className="text-blue-600 hover:text-blue-500">
//               support team
//             </a>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EmailVerificationPage;

import React, { useState, useEffect, useRef } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Mail } from "lucide-react";
import { authService } from "../services/authService.js";
import Button from "../components/Button.jsx";
import Loading from "../components/Loading.jsx";

const EmailVerificationPage = () => {
  const [searchParams] = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState("verifying"); // 'verifying', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const hasVerified = useRef(false); // Prevent double verification

  const token = searchParams.get("token");

  console.log("Email verification token:", token);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setVerificationStatus("error");
        setErrorMessage("Invalid verification link");
        return;
      }

      // Prevent double verification in React StrictMode
      if (hasVerified.current) {
        return;
      }
      hasVerified.current = true;

      try {
        console.log("Making verification request with token:", token);
        console.log("Token length:", token?.length);
        const result = await authService.verifyEmail(token);
        console.log("Verification response:", result);

        // Check if the response indicates success
        if (
          result &&
          (result.success === true ||
            result.data?.success === true ||
            result.message?.includes("successfully"))
        ) {
          setVerificationStatus("success");
        } else {
          throw new Error(result.message || "Verification failed");
        }
      } catch (error) {
        console.error("Verification error:", error);
        console.error("Error response:", error.response);
        console.error("Error status:", error.response?.status);

        // Check if it's already verified (common case)
        const errorMsg = error.response?.data?.message || error.message || "";
        if (
          errorMsg.toLowerCase().includes("already been used") ||
          errorMsg.toLowerCase().includes("already verified")
        ) {
          setVerificationStatus("success");
          return;
        }

        setVerificationStatus("error");

        // Better error handling
        if (error.response?.status === 400) {
          const message =
            error.response?.data?.message || "Email verification failed";
          setErrorMessage(message);
        } else if (error.response?.status === 404) {
          setErrorMessage("Verification endpoint not found");
        } else if (error.response?.status >= 500) {
          setErrorMessage("Server error occurred. Please try again later.");
        } else if (error.code === "NETWORK_ERROR") {
          setErrorMessage("Network error. Please check your connection.");
        } else {
          setErrorMessage(
            error.response?.data?.message ||
              error.message ||
              "Email verification failed"
          );
        }
      }
    };

    verifyEmail();
  }, [token]);

  // Loading state
  if (verificationStatus === "verifying") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loading size="xl" text="Verifying your email..." />
        </div>
      </div>
    );
  }

  // Success state
  if (verificationStatus === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="text-green-600" size={32} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Email verified!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Your email address has been successfully verified. You can now
              access all features of your account.
            </p>
          </div>

          <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
            <div className="space-y-4 text-center">
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-gray-900">
                  Welcome to UserHub!
                </h3>
                <p className="text-sm text-gray-600">
                  Your account is now fully activated and ready to use.
                </p>
              </div>

              <div className="space-y-3 pt-4">
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
      </div>
    );
  }

  // Error state
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <XCircle className="text-red-600" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Verification failed
          </h2>
          <p className="mt-2 text-sm text-gray-600">{errorMessage}</p>
        </div>

        <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
          <div className="space-y-4 text-center">
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-gray-900">
                What happened?
              </h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>This verification link may have:</p>
                <ul className="text-left space-y-1">
                  <li>• Expired (links are valid for 24 hours)</li>
                  <li>• Already been used successfully</li>
                  <li>• Been corrupted during forwarding</li>
                  <li>• Been generated for a different email</li>
                </ul>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              {errorMessage?.includes("already been used") ? (
                <Link to="/login">
                  <Button variant="primary" size="lg" className="w-full">
                    Sign in to your account
                  </Button>
                </Link>
              ) : (
                <Link to="/register">
                  <Button variant="primary" size="lg" className="w-full">
                    <Mail size={16} className="mr-2" />
                    Register with new email
                  </Button>
                </Link>
              )}

              <Link to="/login">
                <Button variant="outline" size="lg" className="w-full">
                  Back to login
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Additional Help */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Still having issues? Contact our{" "}
            <a href="#" className="text-blue-600 hover:text-blue-500">
              support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
