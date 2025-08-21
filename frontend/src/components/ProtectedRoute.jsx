import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { authState } = useAuth();
  const location = useLocation();

  if (!authState.isAuthenticated) {
    // Redirect to the login page if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required role if allowedRoles is provided
  if (allowedRoles && !allowedRoles.includes(authState.user?.role)) {
    // Redirect to dashboard if authenticated but not authorized
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
