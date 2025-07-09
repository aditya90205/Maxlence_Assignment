import React from "react";
import { Link } from "react-router-dom";
import { Shield, ArrowLeft } from "lucide-react";
import Button from "../components/Button.jsx";

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="text-red-600" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Access Denied</h2>
          <p className="mt-2 text-sm text-gray-600">
            You don't have permission to access this page.
          </p>
        </div>

        {/* Content */}
        <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
          <div className="space-y-6 text-center">
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-gray-900">
                Insufficient Permissions
              </h3>
              <p className="text-sm text-gray-600">
                This page requires specific permissions that your account
                doesn't have. Please contact an administrator if you believe
                this is an error.
              </p>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="space-y-3">
                <Link to="/dashboard">
                  <Button variant="primary" size="lg" className="w-full">
                    Go to Dashboard
                  </Button>
                </Link>

                <Link to="/">
                  <Button variant="outline" size="lg" className="w-full">
                    <ArrowLeft size={16} className="mr-2" />
                    Go Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Help */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Need access? Contact your{" "}
            <a href="#" className="text-blue-600 hover:text-blue-500">
              administrator
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
