import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const data = [
  { country: 'India', count: 100 },
  { country: 'India', count: 80 },
  { country: 'India', count: 70 },
  { country: 'India', count: 60 },
  { country: 'India', count: 50 },
];

const barColor = "#A855F7";

const TopCountriesChart = () => {
  return (
    <div>
      <span className="terminal-eyebrow">top.countries</span>
      <h2 className="text-lg font-bold text-htb-text mt-0.5 mb-4">Top Countries</h2>

      <ResponsiveContainer width="100%" height={350} className="mt-6">
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 5, right: 20, left: 0, bottom: 0 }}
          barCategoryGap="30%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: '#A4B1CD' }}
            axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
          />
          <YAxis
            type="category"
            dataKey="country"
            tick={{ fontSize: 11, fill: '#A4B1CD' }}
            axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
          />
          <Tooltip
            contentStyle={{
              background: '#111927',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '0.375rem',
              color: '#E6EDF7',
              fontFamily: '"JetBrains Mono", ui-monospace, monospace',
              fontSize: 12,
            }}
            cursor={{ fill: 'rgba(168, 85, 247, 0.05)' }}
          />
          <Bar dataKey="count" fill={barColor} radius={[0, 6, 6, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={barColor} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopCountriesChart;
