import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';
import type { AdminDashboardStats } from '../../../services/adminApiSlice';

const COLORS = ['#FCD34D', '#60A5FA', '#34D399', '#A78BFA', '#10B981', '#EF4444'];
const STATUS_LABELS = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
  rejected: 'Rejected',
};

interface StatusDistributionProps {
  stats: AdminDashboardStats;
}

export default function StatusDistribution({ stats }: StatusDistributionProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
        Request Status Distribution
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={stats.requests_by_status}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
              nameKey="status"
              label={({ name, percent }) =>
                `${STATUS_LABELS[name as keyof typeof STATUS_LABELS] || name}: ${(
                  percent * 100
                ).toFixed(0)}%`
              }
            >
              {stats.requests_by_status.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
