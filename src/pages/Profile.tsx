import React from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import ProfileUpdate from '../components/dashboard/ProfileUpdate';

export default function Profile() {
  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Profile Settings</h1>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="py-4">
            <ProfileUpdate />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
