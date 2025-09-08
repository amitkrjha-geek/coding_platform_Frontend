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
      <div className="w-full h-64 flex justify-center items-center text-gray-500">
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
              <stop offset="5%" stopColor="#742193" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#742193" stopOpacity={0.05}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="displayDate" 
            tick={{ fontSize: 11, fill: '#666' }}
            axisLine={{ stroke: '#e0e0e0' }}
            tickLine={{ stroke: '#e0e0e0' }}
          />
          <YAxis 
            tick={{ fontSize: 11, fill: '#666' }}
            axisLine={{ stroke: '#e0e0e0' }}
            tickLine={{ stroke: '#e0e0e0' }}
            allowDecimals={false}
          />
          <Tooltip 
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                    <p className="font-medium text-gray-900">{label}</p>
                    <p className="text-purple-600">
                      <span className="font-medium">{payload[0].value}</span> new users
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
            stroke="#742193"
            fill="url(#userGradient)"
            strokeWidth={2}
            dot={{ r: 4, fill: "#742193", stroke: "#fff", strokeWidth: 2 }}
            activeDot={{ r: 6, fill: "#742193", stroke: "#fff", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
