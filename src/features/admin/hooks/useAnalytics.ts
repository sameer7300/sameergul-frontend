import { useState, useEffect } from 'react';
import { useGetAnalyticsQuery } from '../../../services/adminApiSlice';
import { format, subDays, startOfDay } from 'date-fns';

interface AnalyticsData {
  total_requests: number;
  completed_requests: number;
  revenue: number;
  response_time: number;
  date: string;
}

interface DateRange {
  start_date: string;
  end_date: string;
}

export function useAnalytics(days = 30) {
  const [dateRange, setDateRange] = useState<DateRange>({
    start_date: format(subDays(startOfDay(new Date()), days), 'yyyy-MM-dd'),
    end_date: format(startOfDay(new Date()), 'yyyy-MM-dd')
  });

  const {
    data: analyticsData,
    isLoading,
    error,
    refetch,
  } = useGetAnalyticsQuery({
    ...dateRange,
    group_by: 'day',
  });

  const calculateMetrics = (analyticsData: AnalyticsData[]) => {
    if (!analyticsData.length) return null;

    return {
      requests: {
        total: analyticsData.reduce((sum, day) => sum + day.total_requests, 0),
        average:
          analyticsData.reduce((sum, day) => sum + day.total_requests, 0) /
          analyticsData.length,
        trend:
          analyticsData.length > 1
            ? (
                ((analyticsData[analyticsData.length - 1].total_requests -
                  analyticsData[0].total_requests) /
                  analyticsData[0].total_requests) *
                100
              ).toFixed(1)
            : '0',
      },
      revenue: {
        total: analyticsData.reduce((sum, day) => sum + day.revenue, 0),
        average:
          analyticsData.reduce((sum, day) => sum + day.revenue, 0) /
          analyticsData.length,
        trend:
          analyticsData.length > 1
            ? (
                ((analyticsData[analyticsData.length - 1].revenue -
                  analyticsData[0].revenue) /
                  analyticsData[0].revenue) *
                100
              ).toFixed(1)
            : '0',
      },
      completionRate: {
        total: analyticsData.reduce((sum, day) => sum + day.completed_requests, 0),
        average:
          analyticsData.reduce((sum, day) => sum + day.completed_requests, 0) /
          analyticsData.length,
        trend:
          analyticsData.length > 1
            ? (
                ((analyticsData[analyticsData.length - 1].completed_requests -
                  analyticsData[0].completed_requests) /
                  analyticsData[0].completed_requests) *
                100
              ).toFixed(1)
            : '0',
      },
      response_time: {
        average: analyticsData.reduce((sum, day) => sum + day.response_time, 0) / analyticsData.length,
        trend:
          analyticsData.length > 1
            ? (
                ((analyticsData[analyticsData.length - 1].response_time -
                  analyticsData[0].response_time) /
                  analyticsData[0].response_time) *
                100
              ).toFixed(1)
            : '0',
      }
    };
  };

  const trends = analyticsData ? calculateMetrics(analyticsData) : null;

  const updateDateRange = (start: Date, end: Date) => {
    setDateRange({
      start_date: format(start, 'yyyy-MM-dd'),
      end_date: format(end, 'yyyy-MM-dd'),
    });
  };

  return {
    analyticsData,
    trends,
    dateRange,
    updateDateRange,
    isLoading,
    error,
    refetch,
  };
}
