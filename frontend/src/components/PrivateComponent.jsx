import { Navigate, Outlet } from "react-router-dom";
import authService from "../services/authService";

const PrivateComponent = () => {
    const isAuthenticated = authService.isAuthenticated();
    const currentUser = authService.getCurrentUser();

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    // If the route requires admin access
    if (currentUser && !currentUser.admin) {
        return <Navigate to="/" />;
    }

    return <Outlet />;
};

export default PrivateComponent;
