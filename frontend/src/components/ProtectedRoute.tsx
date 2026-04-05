import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContextProvider';

/**
 * A component to protect routes that require authentication.
 * If the user is not authenticated, it redirects to the homepage.
 * Otherwise, it renders the child routes.
 */
const ProtectedRoute = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;