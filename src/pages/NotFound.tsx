
import React, { useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="w-full max-w-md text-center animate-fade-in">
        <div className="flex justify-center mb-6">
          <div className="h-24 w-24 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
            <AlertTriangle className="h-12 w-12 text-red-500 dark:text-red-400" />
          </div>
        </div>
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-2 animate-slide-down">404</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-2 animate-slide-down" style={{ animationDelay: "100ms" }}>
          Oops! We couldn't find that page
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          Path: {location.pathname}
        </p>
        <div className="animate-slide-up flex flex-col gap-3 sm:flex-row sm:justify-center" style={{ animationDelay: "200ms" }}>
          <Button 
            onClick={handleGoHome}
            className="px-6 transition-all duration-300 hover:shadow-md"
          >
            Return to Home
          </Button>
          <Button 
            onClick={() => window.history.back()}
            variant="outline"
            className="px-6 transition-all duration-300 hover:shadow-md dark:border-gray-700 dark:text-gray-300"
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
