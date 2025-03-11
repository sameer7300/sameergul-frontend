import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Home,
  MessageCircle,
  FileText,
  Settings,
  Users,
  BarChart,
} from 'lucide-react';

interface AdminLayoutProps {
  children?: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Overview', href: '/admin/dashboard', icon: Home },
    { name: 'Messages', href: '/admin/messages', icon: MessageCircle },
    { name: 'Requests', href: '/admin/requests', icon: FileText },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-gray-800">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <span className="text-xl font-bold text-white">Admin Dashboard</span>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      isActive
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex bg-gray-700 p-4">
            <div className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
                <div>
                  <div className="text-sm font-medium text-white">{user?.email}</div>
                  <div className="text-xs text-gray-300">Administrator</div>
                </div>
                <button
                  onClick={() => logout()}
                  className="ml-auto text-sm text-gray-300 hover:text-white"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="md:hidden bg-gray-800 text-white p-4">
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold">Admin Dashboard</span>
          <button
            onClick={() => logout()}
            className="text-sm text-gray-300 hover:text-white"
          >
            Logout
          </button>
        </div>
        <nav className="mt-4 grid grid-cols-4 gap-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`${
                  isActive
                    ? 'text-white'
                    : 'text-gray-300 hover:text-white'
                } flex flex-col items-center text-xs`}
              >
                <Icon className="h-6 w-6 mb-1" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="md:pl-64">
        <main className="flex-1">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}
