"use client";

import { format, subDays } from 'date-fns';
import { useMemo } from 'react';
import useIsMounted from '@/hooks/useIsMounted';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const getTooltipText = (count: number, date: Date) => {
  if (count === 0) return `No submissions on ${format(date, 'MMMM d, yyyy')}`;
  return `${count} submission${count > 1 ? 's' : ''} on ${format(date, 'MMMM d, yyyy')}`;
};

const getBackgroundColor = (count: number) => {
  switch (count) {
    case 0: return 'bg-[#ebedf0] dark:bg-[#161b22]';
    case 1: return 'bg-[#9be9a8] dark:bg-[#0e4429]';
    case 2: return 'bg-[#40c463] dark:bg-[#006d32]';
    case 3: return 'bg-[#30a14e] dark:bg-[#26a641]';
    case 4: return 'bg-[#216e39] dark:bg-[#39d353]';
    default: return 'bg-[#ebedf0] dark:bg-[#161b22]';
  }
};

const SubmissionHistory = () => {
  const isMounted = useIsMounted();

  // Use useMemo to ensure consistent data generation
  const submissionData = useMemo(() => {
    // Use a fixed seed date for initial render
    const baseDate = new Date(2024, 0, 1);
    const weeks = 52;
    const daysPerWeek = 7;

    return Array(weeks).fill(null).map((_, weekIndex) =>
      Array(daysPerWeek).fill(null).map((_, dayIndex) => {
        const date = subDays(baseDate, (weeks - weekIndex - 1) * 7 + (6 - dayIndex));
        // Use a deterministic pattern instead of random
        const count = Math.floor(((weekIndex + dayIndex) % 5));
        return { count, date };
      })
    );
  }, []);

  if (!isMounted) {
    return (
      <div className="bg-white rounded-xl p-6">
        <div className="h-[300px] bg-gray-100 rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
        <div className="flex items-center gap-2">
          <span className="font-medium">100</span>
          <span className="text-sm text-gray-500">submissions in the past one year</span>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
          <div>Total active days: 3</div>
          <div>Max streak: 1</div>
          <select className="bg-transparent outline-none">
            <option>Current</option>
            <option>2023</option>
            <option>2022</option>
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
          <div className="grid grid-cols-[repeat(52,1fr)] gap-[2px] sm:gap-[3px]">
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