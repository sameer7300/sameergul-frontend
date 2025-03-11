import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { AdminDashboardStats } from '../../../services/adminApiSlice';

interface RequestsChartProps {
  stats: AdminDashboardStats;
}

export default function RequestsChart({ stats }: RequestsChartProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
        Requests by Service Type
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={stats.requests_by_service}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="service" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#6366f1" name="Requests" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
