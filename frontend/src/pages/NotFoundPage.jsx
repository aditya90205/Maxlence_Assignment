import React from "react";
import { Link } from "react-router-dom";
import { FileQuestion, ArrowLeft, Home } from "lucide-react";
import Button from "../components/Button.jsx";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FileQuestion className="text-gray-600" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Page not found</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sorry, we couldn't find the page you're looking for.
          </p>
        </div>

        {/* Content */}
        <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
          <div className="space-y-6 text-center">
            <div className="space-y-3">
              <h3 className="text-6xl font-bold text-gray-300">404</h3>
              <p className="text-sm text-gray-600">
                The page you are looking for might have been removed, had its
                name changed, or is temporarily unavailable.
              </p>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="space-y-3">
                <Link to="/">
                  <Button variant="primary" size="lg" className="w-full">
                    <Home size={16} className="mr-2" />
                    Go Home
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => window.history.back()}
                  className="w-full"
                >
                  <ArrowLeft size={16} className="mr-2" />
                  Go Back
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Help */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Having trouble finding what you need? Contact our{" "}
            <a href="#" className="text-blue-600 hover:text-blue-500">
              support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
