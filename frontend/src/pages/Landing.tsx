import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import Home from "./Home";

/**
 * Smart Landing Page Component
 * 
 * This component handles the root route (/) and implements smart routing:
 * - If user is authenticated → redirect to /home
 * - If user is not authenticated → show the landing page (Home)
 * - While checking auth → show nothing (prevents flash)
 */
const Landing = () => {
    const navigate = useNavigate();
    const { isAuthenticated, isLoading } = useAuth();

    useEffect(() => {
        // Wait for auth check to complete
        if (isLoading) return;

        // If user is authenticated, redirect to home
        if (isAuthenticated) {
            navigate("/home", { replace: true });
        }
    }, [isAuthenticated, isLoading, navigate]);

    // While checking auth, show nothing to prevent flash
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-orange-50 to-pink-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    // If not authenticated, show the landing page
    if (!isAuthenticated) {
        return <Home />;
    }

    // This shouldn't render (redirect happens in useEffect), but just in case
    return null;
};

export default Landing;
