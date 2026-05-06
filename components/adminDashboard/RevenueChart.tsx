import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface RevenueChartProps {
  data: Array<{
    _id: {
      year: number;
      month: number;
    };
    total: number;
  }>;
}

const RevenueChart = ({ data }: RevenueChartProps) => {
  // Process data to create chart format
  const processedData = data.map((item) => ({
    month: new Date(item._id.year, item._id.month - 1).toLocaleDateString('en-US', { month: 'short' }),
    revenue: item.total,
  }));

  // If no data, show empty state
  if (!data || data.length === 0) {
    return (
      <div className="p-4">
        <span className="terminal-eyebrow">revenue</span>
        <h2 className="text-lg font-bold text-htb-text mt-0.5">Revenue</h2>
        <div className="flex justify-center items-center h-64 text-htb-text-dim font-mono uppercase tracking-widest text-sm">
          No revenue data available
        </div>
      </div>
    );
  }
  return (
    <div className="p-4">
      <span className="terminal-eyebrow">revenue</span>
      <h2 className="text-lg font-bold text-htb-text mt-0.5">Revenue</h2>
      <div className="flex justify-end gap-2 mb-3">
        <select className="bg-htb-panel border border-htb-border rounded-md px-3 py-1.5 text-htb-text font-mono text-xs uppercase tracking-wider hover:border-htb-border-hover focus:border-neon/60 focus:ring-1 focus:ring-neon/40 outline-none transition-colors">
          <option>Monthly</option>
          <option>Yearly</option>
        </select>
        <select className="bg-htb-panel border border-htb-border rounded-md px-3 py-1.5 text-htb-text font-mono text-xs uppercase tracking-wider hover:border-htb-border-hover focus:border-neon/60 focus:ring-1 focus:ring-neon/40 outline-none transition-colors">
          <option>2024</option>
          <option>2023</option>
        </select>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={processedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#A4B1CD' }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} />
          <YAxis tick={{ fontSize: 11, fill: '#A4B1CD' }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} />
          <Tooltip
            contentStyle={{
              background: '#111927',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '0.375rem',
              color: '#E6EDF7',
            }}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#9FEF00"
            strokeWidth={2}
            dot={{ r: 5, fill: '#9FEF00', stroke: '#0B0F17', strokeWidth: 2 }}
            activeDot={{ r: 6, fill: '#9FEF00', stroke: '#0B0F17', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
