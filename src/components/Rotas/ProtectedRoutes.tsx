import { Navigate, useLocation } from "react-router-dom";
import type { JSX } from "react";
import AuthRequests from "../../fetch/AuthRequests";

interface ProtectedRouteProps {
    children: JSX.Element;
}

function ProtectedRoute({ children }: ProtectedRouteProps): JSX.Element {
    const location = useLocation();

    return AuthRequests.isAuthenticated()
        ? children
        : <Navigate to="/login" replace state={{ from: location }} />;
};

export default ProtectedRoute;