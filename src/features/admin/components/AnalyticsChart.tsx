import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { AnalyticsData } from '../../../services/adminApiSlice';

interface AnalyticsChartProps {
  data: AnalyticsData[];
}

export default function AnalyticsChart({ data }: AnalyticsChartProps) {
  const formattedData = data.map((item) => ({
    ...item,
    date: format(parseISO(item.date), 'MMM d'),
  }));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
        Analytics Overview
      </h3>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={formattedData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="requests"
              stroke="#6366f1"
              name="Requests"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="revenue"
              stroke="#10b981"
              name="Revenue"
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="avg_response_time"
              stroke="#f59e0b"
              name="Avg Response Time"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
