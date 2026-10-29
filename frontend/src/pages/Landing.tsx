import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import Home from "./Home";
import Loader from "../components/ui/Loader";

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
        return <Loader />;
    }

    // If not authenticated, show the landing page
    if (!isAuthenticated) {
        return <Home />;
    }

    // This shouldn't render (redirect happens in useEffect), but just in case
    return null;
};

export default Landing;
