import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './auth-context';
import { Loading } from '@/components/ui/loading';

type ProtectedRouteProps = {
    allowedRoles?: string[];
};


export default function ProtectedRoute({
    allowedRoles
}: ProtectedRouteProps) {
    const { isAuthenticated, loading, user } = useAuth();

    if (loading) {
        // return <div>Loading...</div>
        return <Loading />
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && (!user || !allowedRoles.includes(user.auth.role || ''))) {
        return <Navigate to="/403" replace />;
    }

    return <Outlet />;
}
