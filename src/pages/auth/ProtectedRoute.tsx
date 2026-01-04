import { Navigate, Outlet } from 'react-router';

const ProtectedRoute = ({ user }: { user: any }) => {
    if (!user || !user.user) {
        return <Navigate to="/" />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
