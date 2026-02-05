import { isAuthenticated } from "../utils/Auth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export function AuthWrapper({ children }) {
    const navigate = useNavigate();
    
    useEffect(() => {
        if (!isAuthenticated()) {
            console.log("Not Authenticated");
            navigate("/login");
        }
    }, [navigate]);
    
    return children;
}