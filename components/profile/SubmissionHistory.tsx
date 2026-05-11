"use client";

import { format, startOfYear, endOfYear, eachDayOfInterval, getDay } from 'date-fns';
import { useMemo, useState, useEffect } from 'react';
import useIsMounted from '@/hooks/useIsMounted';
import { getSubmissionHistory } from '@/API/submission';
import { useSearchParams } from 'next/navigation';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const getTooltipText = (count: number, date: Date) => {
  if (count === 0) return `No submissions on ${format(date, 'MMMM d, yyyy')}`;
  return `${count} submission${count > 1 ? 's' : ''} on ${format(date, 'MMMM d, yyyy')}`;
};

const getBackgroundColor = (count: number) => {
  if (count === 0) return 'bg-htb-panel-2 border border-htb-border/50';
  if (count >= 1 && count <= 2) return 'bg-neon/20 border border-neon/30';
  if (count >= 3 && count <= 4) return 'bg-neon/40 border border-neon/40';
  if (count >= 5 && count <= 7) return 'bg-neon/60 border border-neon/50';
  if (count >= 8 && count <= 12) return 'bg-neon/80 border border-neon/60';
  return 'bg-neon border border-neon shadow-neon-sm';
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


  const params = useSearchParams();
  const userId = params.get("id");


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
      <div className="panel p-6">
        <div className="h-[300px] bg-htb-panel-2 rounded animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="panel p-6">
        <div className="text-center">
          <p className="text-danger font-medium">Failed to load submission history</p>
          <p className="text-sm text-htb-text-dim mt-1 font-mono">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="panel p-5 sm:p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5 gap-3">
        <div className="flex items-center gap-2">
          <span className="terminal-eyebrow">activity.heatmap</span>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="font-mono uppercase tracking-wider text-htb-text-dim">Submissions</span>
            <span className="font-mono font-semibold text-neon tabular-nums">
              {historyData?.totalSubmissions || 0}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-mono uppercase tracking-wider text-htb-text-dim">Active</span>
            <span className="font-mono font-semibold text-htb-text tabular-nums">
              {historyData?.activeDays || 0}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-mono uppercase tracking-wider text-htb-text-dim">Max streak</span>
            <span className="font-mono font-semibold text-htb-text tabular-nums">
              {historyData?.maxStreak || 0}
            </span>
          </div>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="bg-htb-panel border border-htb-border rounded px-2 py-1 text-htb-text font-mono text-xs uppercase tracking-wider hover:border-htb-border-hover focus:border-neon/60 focus:ring-1 focus:ring-neon/40 outline-none transition-colors"
          >
            <option value={new Date().getFullYear()}>Current</option>
            <option value={new Date().getFullYear() - 1}>{new Date().getFullYear() - 1}</option>
            <option value={new Date().getFullYear() - 2}>{new Date().getFullYear() - 2}</option>
          </select>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="w-full overflow-x-auto scrollbar-hide pb-2 -mx-4 sm:mx-0">
        <div className="min-w-[750px] px-4 sm:px-0">
          {/* Months */}
          <div className="grid grid-cols-12 mb-2">
            {months.map((month) => (
              <div key={month} className="text-[10px] font-mono uppercase tracking-wider text-htb-text-dim">
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
                      w-3 h-3 rounded-[2px] cursor-pointer
                      ${getBackgroundColor(day.count)}
                      hover:ring-1 hover:ring-neon hover:ring-offset-1 hover:ring-offset-htb-panel
                      group relative transition-all
                    `}
                    title={getTooltipText(day.count, day.date)}
                  >
                    {/* Tooltip */}
                    <div className="invisible group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-htb-text bg-htb-bg-deep border border-htb-border rounded whitespace-nowrap z-10 shadow-panel">
                      {getTooltipText(day.count, day.date)}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-1 border-4 border-transparent border-t-htb-border" />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-end gap-2 mt-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-htb-text-dim">Less</span>
            <div className="flex gap-[3px]">
              {[0, 1, 3, 5, 9, 13].map((count) => (
                <div
                  key={count}
                  className={`w-3 h-3 rounded-[2px] ${getBackgroundColor(count)}`}
                />
              ))}
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-htb-text-dim">More</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionHistory;