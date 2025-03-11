import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';
import DashboardHome from './DashboardHome';

export default function Dashboard() {
  const { user } = useAuth();
  const location = useLocation();

  // Redirect admin users to admin dashboard
  if (user?.is_staff) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <DashboardLayout>
      {location.pathname === '/dashboard' ? <DashboardHome /> : <Outlet />}
    </DashboardLayout>
  );
}