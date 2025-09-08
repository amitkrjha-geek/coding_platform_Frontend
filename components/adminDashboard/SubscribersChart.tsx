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

  // Colors for the charts
  const colors = ['#742193', '#22C55E', '#EF4444', '#3B82F6', '#F59E0B'];

  // If no data, show empty state
  if (!data || data.length === 0) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold">Plan Subscriptions</h2>
        <div className="flex justify-center items-center h-64 text-gray-500">
          No subscription data available
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Plan Subscriptions</h2>
      

      {/* Pie Chart for Revenue Distribution */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-700">Revenue Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={processedData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="revenue"
              nameKey="plan"
            >
              {processedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
              labelFormatter={(label) => `Plan: ${label}`}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="bg-purple-50 p-3 rounded-lg">
          <h4 className="text-sm font-medium text-purple-800">Total Subscribers</h4>
          <p className="text-2xl font-bold text-purple-600">
            {processedData.reduce((sum, item) => sum + item.subscribers, 0)}
          </p>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <h4 className="text-sm font-medium text-green-800">Total Revenue</h4>
          <p className="text-2xl font-bold text-green-600">
          ₹{processedData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscribersChart;
