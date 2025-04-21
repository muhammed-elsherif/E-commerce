import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import authService from '../../services/authService';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getCurrentUser();

  if (!isAuthenticated) {
    // Redirect to login page but save the attempted url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && (!user || !user.admin)) {
    // Redirect to home page if admin access is required but user is not admin
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute; 