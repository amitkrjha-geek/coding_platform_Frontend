import React from 'react';
import {
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface SubscribersChartProps {
  data: Array<{
    _id: string;
    count: number;
    totalRevenue: number;
  }>;
}

const SubscribersChart = ({ data }: SubscribersChartProps) => {
  // Process data to create chart format
  const processedData = data.map((item) => ({
    plan: item._id,
    subscribers: item.count,
    revenue: item.totalRevenue,
  }));

  // Colors for the charts (HTB palette)
  const colors = ['#A855F7', '#A855F7', '#FF3E3E', '#38BDF8', '#FFAF00'];

  // If no data, show empty state
  if (!data || data.length === 0) {
    return (
      <div className="p-4">
        <span className="terminal-eyebrow">plan.subscriptions</span>
        <h2 className="text-lg font-bold text-htb-text mt-0.5">Plan Subscriptions</h2>
        <div className="flex justify-center items-center h-64 text-htb-text-dim font-mono uppercase tracking-widest text-sm">
          No subscription data available
        </div>
      </div>
    );
  }

  return (
    <div>
      <span className="terminal-eyebrow">plan.subscriptions</span>
      <h2 className="text-lg font-bold text-htb-text mt-0.5 mb-4">Plan Subscriptions</h2>

      {/* Pie Chart for Revenue Distribution */}
      <div>
        <h3 className="text-[10px] font-mono uppercase tracking-widest font-semibold text-htb-muted mb-3">
          Revenue Distribution
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={processedData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={4}
              dataKey="revenue"
              nameKey="plan"
              stroke="#0B0F17"
              strokeWidth={2}
            >
              {processedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
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
              formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
              labelFormatter={(label) => `Plan: ${label}`}
            />
            <Legend wrapperStyle={{ color: '#A4B1CD', fontSize: 12, fontFamily: '"JetBrains Mono", ui-monospace, monospace', textTransform: 'uppercase', letterSpacing: '0.1em' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-md border border-neon/30 bg-neon/5 p-3">
          <h4 className="text-[10px] font-mono uppercase tracking-widest font-semibold text-neon">Total Subscribers</h4>
          <p className="font-mono text-2xl font-bold text-htb-text tabular-nums mt-1">
            {processedData.reduce((sum, item) => sum + item.subscribers, 0)}
          </p>
        </div>
        <div className="rounded-md border border-purple-500/30 bg-purple-500/5 p-3">
          <h4 className="text-[10px] font-mono uppercase tracking-widest font-semibold text-purple-300">Total Revenue</h4>
          <p className="font-mono text-2xl font-bold text-htb-text tabular-nums mt-1">
            ₹{processedData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscribersChart;
