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
    "#A855F7", // Neon
    "#A855F7", // Purple
    "#FF3E3E", // Danger
    "#38BDF8", // Sky
    "#FFAF00", // Warn
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
      <div className="w-full h-64 flex justify-center items-center text-htb-text-dim font-mono uppercase tracking-widest text-sm">
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
            paddingAngle={4}
            dataKey="value"
            stroke="#0B0F17"
            strokeWidth={2}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: '#111927',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '0.375rem',
              color: '#E6EDF7',
              fontFamily: '"JetBrains Mono", ui-monospace, monospace',
              fontSize: 12,
            }}
          />
          <Legend wrapperStyle={{ color: '#A4B1CD', fontSize: 12, fontFamily: '"JetBrains Mono", ui-monospace, monospace', textTransform: 'uppercase', letterSpacing: '0.1em' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
