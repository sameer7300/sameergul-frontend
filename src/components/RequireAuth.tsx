import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface RequireAuthProps {
  isAdmin?: boolean;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ isAdmin = false }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect them to the login page, but save the current location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If admin access is required but user is not admin, redirect to home
  if (isAdmin && !user?.is_staff) {
    console.log('User is not admin, redirecting to home', user);
    return <Navigate to="/" replace />;
  }

  // If they are authenticated (and have admin access if required), render the child routes
  return <Outlet />;
};

export default RequireAuth;
