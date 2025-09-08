"use client";

import { format, startOfYear, endOfYear, eachDayOfInterval, getDay } from 'date-fns';
import { useMemo, useState, useEffect } from 'react';
import useIsMounted from '@/hooks/useIsMounted';
import { getSubmissionHistory } from '@/API/submission';
import { getCurrentUserId } from '@/config/token';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const getTooltipText = (count: number, date: Date) => {
  if (count === 0) return `No submissions on ${format(date, 'MMMM d, yyyy')}`;
  return `${count} submission${count > 1 ? 's' : ''} on ${format(date, 'MMMM d, yyyy')}`;
};

const getBackgroundColor = (count: number) => {
  if (count === 0) return 'bg-[#ebedf0] dark:bg-[#161b22]';
  if (count >= 1 && count <= 2) return 'bg-[#2dc653] dark:bg-[#0e4429]';
  if (count >= 3 && count <= 4) return 'bg-[#25a244] dark:bg-[#0e4429]';
  if (count >= 5 && count <= 7) return 'bg-[#155d27] dark:bg-[#006d32]';
  if (count >= 8 && count <= 12) return 'bg-[#10451d] dark:bg-[#26a641]';
  return 'bg-[#216e39] dark:bg-[#39d353]';
};

interface SubmissionHistoryData {
  dailyCounts: Record<string, number>;
  totalSubmissions: number;
  activeDays: number;
  maxStreak: number;
  currentStreak: number;
  year: number;
}

const SubmissionHistory = () => {
  const isMounted = useIsMounted();
  const userId = getCurrentUserId();

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [historyData, setHistoryData] = useState<SubmissionHistoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch submission history data
  useEffect(() => {
    const fetchHistory = async () => {
      if (!userId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await getSubmissionHistory(userId, selectedYear);
        if (response.success) {
          setHistoryData(response.data);
        } else {
          setError(response.message || 'Failed to fetch submission history');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch submission history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [userId, selectedYear]);

  // Generate calendar grid from real data
  const submissionData = useMemo(() => {
    if (!historyData) return [];

    const year = selectedYear;
    const startDate = startOfYear(new Date(year, 0, 1));
    const endDate = endOfYear(new Date(year, 11, 31));
    const allDays = eachDayOfInterval({ start: startDate, end: endDate });

    // Create a 7x53 grid (7 days per week, ~53 weeks per year)
    const weeks: Array<Array<{ count: number; date: Date }>> = [];
    let currentWeek: Array<{ count: number; date: Date }> = [];

    allDays.forEach((day, index) => {
      const dayOfWeek = getDay(day); // 0 = Sunday, 1 = Monday, etc.
      const dateKey = format(day, 'yyyy-MM-dd');
      const count = historyData.dailyCounts[dateKey] || 0;

      // Start a new week on Sunday (day 0) or if it's the first day
      if (dayOfWeek === 0 || index === 0) {
        if (currentWeek.length > 0) {
          weeks.push(currentWeek);
        }
        currentWeek = [];
      }

      currentWeek.push({ count, date: day });

      // If it's the last day, push the current week
      if (index === allDays.length - 1) {
        weeks.push(currentWeek);
      }
    });

    return weeks;
  }, [historyData, selectedYear]);

  if (!isMounted || loading) {
    return (
      <div className="bg-white rounded-xl p-6">
        <div className="h-[300px] bg-gray-100 rounded-lg animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl p-6">
        <div className="text-center text-red-500">
          <p>Failed to load submission history</p>
          <p className="text-sm text-gray-500 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
        <div className="flex items-center gap-2">
          <span className="font-medium">{historyData?.totalSubmissions || 0}</span>
          <span className="text-sm text-gray-500">submissions in {selectedYear}</span>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
          <div>Total active days: {historyData?.activeDays || 0}</div>
          <div>Max streak: {historyData?.maxStreak || 0}</div>
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="bg-transparent outline-none border border-gray-200 rounded px-2 py-1"
          >
            <option value={new Date().getFullYear()}>Current</option>
            <option value={new Date().getFullYear() - 1}>{new Date().getFullYear() - 1}</option>
            <option value={new Date().getFullYear() - 2}>{new Date().getFullYear() - 2}</option>
          </select>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="w-full overflow-x-auto scrollbar-hide pb-4 -mx-4 sm:mx-0">
        <div className="min-w-[750px] px-4 sm:px-0">
          {/* Months */}
          <div className="grid grid-cols-12 mb-2">
            {months.map((month) => (
              <div key={month} className="text-xs text-gray-400">
                {month}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-[repeat(53,1fr)] gap-[2px] sm:gap-[3px]">
            {submissionData.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-rows-7 gap-[3px]">
                {week.map((day, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className={`
                      w-3 h-3 rounded-sm cursor-pointer
                      ${getBackgroundColor(day.count)}
                      hover:ring-2 hover:ring-gray-400 hover:ring-offset-2
                      group relative
                    `}
                    title={getTooltipText(day.count, day.date)}
                  >
                    {/* Tooltip */}
                    <div className="invisible group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded whitespace-nowrap z-10">
                      {getTooltipText(day.count, day.date)}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-1 border-4 border-transparent border-t-gray-900" />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionHistory;