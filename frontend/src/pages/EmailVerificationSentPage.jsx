import React from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import Button from "../components/Button.jsx";

const EmailVerificationSentPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="text-blue-600" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Check your email</h2>
          <p className="mt-2 text-sm text-gray-600">
            We've sent you a verification link to complete your registration.
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
          <div className="space-y-6 text-center">
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-gray-900">
                Verify your email address
              </h3>
              <p className="text-sm text-gray-600">
                Click the verification link in the email we sent you to activate
                your account.
              </p>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="space-y-4">
                <div className="text-sm text-gray-600">
                  <p className="font-medium mb-2">Didn't receive the email?</p>
                  <ul className="space-y-1 text-left">
                    <li>• Check your spam or junk folder</li>
                    <li>• Make sure you entered the correct email address</li>
                    <li>• Wait a few minutes for the email to arrive</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <Link to="/register">
                    <Button variant="primary" size="lg" className="w-full">
                      Try with different email
                    </Button>
                  </Link>

                  <Link to="/login">
                    <Button variant="outline" size="lg" className="w-full">
                      <ArrowLeft size={16} className="mr-2" />
                      Back to login
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Help */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Need help? Contact our{" "}
            <a href="#" className="text-blue-600 hover:text-blue-500">
              support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationSentPage;
