import React from 'react';
import { useGetDashboardStatsQuery } from '../../../services/adminApiSlice';
import StatsOverview from '../components/StatsOverview';
import RequestsChart from '../components/RequestsChart';
import RecentRequests from '../components/RecentRequests';
import StatusDistribution from '../components/StatusDistribution';
import AdminLayout from '../../../components/admin/AdminLayout';
import { Outlet } from 'react-router-dom';

export default function AdminDashboard() {
  const { data: stats, isLoading, error } = useGetDashboardStatsQuery();

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      );
    }

    if (error || !stats) {
      return (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">
            Error loading dashboard data
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Please try refreshing the page.
          </p>
        </div>
      );
    }

    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Stats Overview */}
          <div className="py-4">
            <StatsOverview stats={stats} />
          </div>

          {/* Charts Grid */}
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <RequestsChart stats={stats} />
            <StatusDistribution stats={stats} />
          </div>

          {/* Recent Requests */}
          <div className="mt-4">
            <RecentRequests requests={stats.recent_requests} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      {renderContent()}
      <Outlet />
    </AdminLayout>
  );
}
