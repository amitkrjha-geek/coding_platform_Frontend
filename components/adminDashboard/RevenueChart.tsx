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
        <h2 className="text-xl font-bold">Revenue</h2>
        <div className="flex justify-center items-center h-64 text-gray-500">
          No revenue data available
        </div>
      </div>
    );
  }
  return (
    <div className=" p-4 ">
      <h2 className="text-xl font-bold">Revenue</h2>
      <div className="flex justify-end space-x-4 mb-2">
        <select className="border rounded px-2 py-1">
          <option>Monthly</option>
          <option>Yearly</option>
        </select>
        <select className="border rounded px-2 py-1">
          <option>2024</option>
          <option>2023</option>
        </select>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={processedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#742193"
            strokeWidth={2}
            dot={{ r: 6, fill: '#F9A825' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
