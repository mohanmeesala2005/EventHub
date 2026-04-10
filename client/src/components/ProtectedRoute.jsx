import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, getUserFromStorage } from '../utils/auth';

const ProtectedRoute = ({ children, requiredRole }) => {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && getUserFromStorage()?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
