"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface ChallengeChartProps {
  data: Array<{
    _id: string;
    count: number;
    totalSubmissions: number;
  }>;
}

export default function ChallengeChart({ data }: ChallengeChartProps) {
  const colors = [
    "#742193", // Purple
    "#22C55E", // Green
    "#EF4444", // Red
    "#3B82F6", // Blue
    "#F59E0B", // Yellow
  ];

  // Process data for recharts
  const chartData = data.map((item, index) => ({
    name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
    value: item.count,
    color: colors[index % colors.length],
  }));

  // If no data, show empty state
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-64 flex justify-center items-center text-gray-500">
        No challenge data available
      </div>
    );
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
