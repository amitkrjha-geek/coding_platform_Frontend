"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

interface DailyUsersChartProps {
  data: Array<{
    id: string;
    name: string;
    createdAt: string;
  }>;
}

export default function DailyUsersChart({ data }: DailyUsersChartProps) {
  // Process user data to get daily registrations
  const processUserData = () => {
    if (!data || data.length === 0) return [];

    // Group users by date
    const userCountByDate = data.reduce((acc: any, user) => {
      const date = new Date(user.createdAt);
      const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD format
      
      if (!acc[dateKey]) {
        acc[dateKey] = 0;
      }
      acc[dateKey]++;
      return acc;
    }, {});

    // Convert to array and sort by date
    const processedData = Object.entries(userCountByDate)
      .map(([date, count]) => ({
        date: date,
        displayDate: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        users: count as number
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return processedData;
  };

  const processedData = processUserData();

  // If no data, show empty state
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-64 flex justify-center items-center text-htb-text-dim font-mono uppercase tracking-widest text-sm">
        No user registration data available
      </div>
    );
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <defs>
            <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#A855F7" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#A855F7" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis
            dataKey="displayDate"
            tick={{ fontSize: 11, fill: '#A4B1CD' }}
            axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
            tickLine={{ stroke: 'rgba(255,255,255,0.06)' }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#A4B1CD' }}
            axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
            tickLine={{ stroke: 'rgba(255,255,255,0.06)' }}
            allowDecimals={false}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-htb-panel p-3 border border-htb-border rounded-md shadow-panel-lg">
                    <p className="font-mono text-xs uppercase tracking-widest text-htb-text-dim">{label}</p>
                    <p className="text-neon font-mono text-sm mt-1">
                      <span className="font-bold tabular-nums">{payload[0].value}</span> new users
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="users"
            stroke="#A855F7"
            fill="url(#userGradient)"
            strokeWidth={2}
            dot={{ r: 4, fill: "#A855F7", stroke: "#0B0F17", strokeWidth: 2 }}
            activeDot={{ r: 6, fill: "#A855F7", stroke: "#0B0F17", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
