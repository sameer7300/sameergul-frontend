import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute - Current user:', user); // Debug log

  // If we have a user, they're authenticated
  if (user) {
    // Check for required role if specified
    if (requiredRole && user.role !== requiredRole) {
      console.log('Role check failed:', { required: requiredRole, actual: user.role });
      return <Navigate to="/" replace />;
    }
    return <>{children}</>;
  }

  // No user, redirect to login
  console.log('No user found, redirecting to login');
  return <Navigate to="/login" state={{ from: location }} replace />;
}
