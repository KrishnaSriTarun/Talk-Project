/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading state

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch("https://talk-project.onrender.com/auth/check", {
                    credentials: "include", // Important! Ensures cookies are sent
                });

                const data = await response.json();
                setIsAuthenticated(data.authenticated);
            } catch (error) {
                console.error("Auth check failed:", error);
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, []);

    if (isAuthenticated === null) {
        return <p>Loading...</p>; // Show a loading message while checking authentication
    }

    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
