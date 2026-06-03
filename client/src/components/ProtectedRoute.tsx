import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, getUserFromStorage } from '../utils/auth';

type Props = {
  children: React.ReactNode;
  requiredRole?: string;
};

const ProtectedRoute: React.FC<Props> = ({ children, requiredRole }) => {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && getUserFromStorage()?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
