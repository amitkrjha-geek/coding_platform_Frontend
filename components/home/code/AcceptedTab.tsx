"use client"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// Sample data for the distribution chart
const data = Array.from({ length: 50 }, (_, index) => ({
  time: index * 6, // 0ms to 300ms
  percentage:
    index === 8
      ? 25
      : // Peak at around 50ms
        index < 15
        ? Math.random() * 15
        : // Higher values before 90ms
          Math.random() * 5, // Lower values after 90ms
}))

const AcceptedTab = () => {
  return (
    <div className="w-full">
      {/* Header with back navigation */}
      <div className="mb-6">
        <Link href="/submissions" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft className="w-4 h-4 mr-1" />
          All Submissions
        </Link>
        <div className="flex items-start gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-green-500 font-semibold text-lg">Accepted</span>
              <span className="text-gray-600 text-sm">98/98 testcases passed</span>
            </div>
            <div className="text-sm text-gray-500 mt-1">submitted at Feb 01, 2025 06:44</div>
          </div>
        </div>
      </div>

      {/* Runtime and Memory Stats */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-medium">Runtime</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold">59</span>
            <span className="text-gray-600">ms</span>
            <span className="text-gray-600 ml-2">Beats</span>
            <span className="font-medium">18.09%</span>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-medium">Memory</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold">32.90</span>
            <span className="text-gray-600">MB</span>
            <span className="text-gray-600 ml-2">Beats</span>
            <span className="font-medium">92.00%</span>
          </div>
        </div>
      </div>

      {/* Distribution Chart */}
      <div className="mb-8">
        <div className="bg-white rounded-lg p-4 border">
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPercentage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="time" tickFormatter={(value) => `${value}ms`} interval={10} tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(value) => `${value}%`} tick={{ fontSize: 12 }} domain={[0, 30]} />
                <Tooltip
                  formatter={(value: number) => [`${value.toFixed(1)}%`, "Submissions"]}
                  labelFormatter={(label) => `Runtime: ${label}ms`}
                />
                <Area
                  type="monotone"
                  dataKey="percentage"
                  stroke="#3b82f6"
                  fill="url(#colorPercentage)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="flex justify-between text-sm text-gray-500 mt-2 px-4">
          <span>3ms</span>
          <span>56ms</span>
          <span>109ms</span>
          <span>161ms</span>
          <span>214ms</span>
          <span>267ms</span>
        </div>
      </div>

      {/* Code Section */}
      <div className="rounded-lg border bg-white">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Code</span>
            <Badge variant="secondary">C++</Badge>
          </div>
        </div>
        <div className="p-4">
          <pre className="text-sm font-mono overflow-x-auto">
            <code className="language-cpp">
              {`class MyCalendarThree {
public:
    map<int, int>mp;
    int maxCount = 0;
    MyCalendarThree() {
        
    }
}`}
            </code>
          </pre>
        </div>
        <div className="p-4 border-t">
          <Button variant="outline" className="w-full">
            View more
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AcceptedTab

