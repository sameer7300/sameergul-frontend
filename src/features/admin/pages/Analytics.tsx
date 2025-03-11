import React from 'react';
import { format } from 'date-fns';
import { useAnalytics } from '../hooks/useAnalytics';
import AnalyticsChart from '../components/AnalyticsChart';

export default function Analytics() {
  const {
    analyticsData,
    trends,
    isLoading,
    error,
  } = useAnalytics(30);

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-32 bg-gray-200 rounded mb-4"></div>
        <div className="h-96 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (error || !analyticsData || !trends) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">
          Error loading analytics data
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
        <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Trends Overview */}
        <div className="mt-4">
          <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* Requests Trend */}
            <div className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden">
              <dt>
                <div className="absolute bg-indigo-500 rounded-md p-3">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <p className="ml-16 text-sm font-medium text-gray-500 truncate">
                  Total Requests
                </p>
              </dt>
              <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
                <p className="text-2xl font-semibold text-gray-900">
                  {trends.requests.total}
                </p>
                <p
                  className={`ml-2 flex items-baseline text-sm font-semibold ${
                    Number(trends.requests.trend) >= 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {trends.requests.trend}%
                </p>
              </dd>
            </div>

            {/* Revenue Trend */}
            <div className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden">
              <dt>
                <div className="absolute bg-green-500 rounded-md p-3">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="ml-16 text-sm font-medium text-gray-500 truncate">
                  Total Revenue
                </p>
              </dt>
              <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
                <p className="text-2xl font-semibold text-gray-900">
                  ${trends.revenue.total.toLocaleString()}
                </p>
                <p
                  className={`ml-2 flex items-baseline text-sm font-semibold ${
                    Number(trends.revenue.trend) >= 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {trends.revenue.trend}%
                </p>
              </dd>
            </div>

            {/* Response Time Trend */}
            <div className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden">
              <dt>
                <div className="absolute bg-yellow-500 rounded-md p-3">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="ml-16 text-sm font-medium text-gray-500 truncate">
                  Avg Response Time
                </p>
              </dt>
              <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
                <p className="text-2xl font-semibold text-gray-900">
                  {trends.response_time.average}m
                </p>
                <p
                  className={`ml-2 flex items-baseline text-sm font-semibold ${
                    Number(trends.response_time.trend) <= 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {trends.response_time.trend}%
                </p>
              </dd>
            </div>
          </dl>
        </div>

        {/* Analytics Chart */}
        <div className="mt-8">
          <AnalyticsChart data={analyticsData} />
        </div>
      </div>
    </div>
  );
}
