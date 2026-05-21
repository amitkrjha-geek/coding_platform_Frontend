"use client";

import React from "react";
import { PieChart, Pie, Legend, Tooltip, Cell } from "recharts";

const data = [
  { name: "Active Users", value: 70, color: "#A855F7" },
  { name: "Non Active", value: 30, color: "#A4B1CD" },
];

const UserPieChart = () => {
  return (
    <div className="flex p-2">
      <PieChart width={400} height={280}>
        <Pie
          dataKey="value"
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={120}
          stroke="#0B0F17"
          strokeWidth={2}
          label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
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
    </div>
  );
};

export default UserPieChart;
