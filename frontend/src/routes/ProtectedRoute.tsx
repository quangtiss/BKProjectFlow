import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './auth-context';

type ProtectedRouteProps = {
    allowedRoles?: string[];
};


export default function ProtectedRoute({
    allowedRoles
}: ProtectedRouteProps) {
    const { isAuthenticated, loading, role } = useAuth();

    if (loading) {
        return <div>Loading...</div>
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role || '')) {
        return <Navigate to="/403" replace />;
    }

    return <Outlet />;
}
