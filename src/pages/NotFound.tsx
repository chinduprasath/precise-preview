
import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 px-4">
      <div className="w-full max-w-md text-center animate-fade-in">
        <div className="flex justify-center mb-6">
          <div className="h-24 w-24 rounded-full bg-red-50 flex items-center justify-center">
            <AlertTriangle className="h-12 w-12 text-red-500" />
          </div>
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-2 animate-slide-down">404</h1>
        <p className="text-xl text-gray-600 mb-8 animate-slide-down" style={{ animationDelay: "100ms" }}>
          Oops! We couldn't find that page
        </p>
        <div className="animate-slide-up" style={{ animationDelay: "200ms" }}>
          <Link to="/">
            <Button className="px-6 transition-all duration-300 hover:shadow-md">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
