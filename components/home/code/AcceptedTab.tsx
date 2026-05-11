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
        <Link
          href="/submissions"
          className="inline-flex items-center text-[11px] font-mono uppercase tracking-widest text-htb-muted hover:text-neon mb-4 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
          All Submissions
        </Link>
        <div className="flex items-start gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-neon font-semibold text-lg inline-flex items-center gap-2">
                <span className="block w-1.5 h-1.5 rounded-full bg-neon shadow-neon-sm" />
                Accepted
              </span>
              <span className="text-htb-muted text-sm font-mono">
                98/98 testcases passed
              </span>
            </div>
            <div className="text-xs text-htb-text-dim font-mono uppercase tracking-wider mt-1">
              Submitted Feb 01, 2025 06:44
            </div>
          </div>
        </div>
      </div>

      {/* Runtime and Memory Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="panel p-4">
          <div className="terminal-eyebrow mb-2">runtime</div>
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-mono text-2xl font-bold text-htb-text tabular-nums">59</span>
            <span className="text-htb-muted text-sm">ms</span>
            <span className="text-htb-text-dim text-xs ml-2 font-mono uppercase tracking-wider">Beats</span>
            <span className="text-neon font-mono font-semibold text-sm">18.09%</span>
          </div>
        </div>
        <div className="panel p-4">
          <div className="terminal-eyebrow mb-2">memory</div>
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-mono text-2xl font-bold text-htb-text tabular-nums">32.90</span>
            <span className="text-htb-muted text-sm">MB</span>
            <span className="text-htb-text-dim text-xs ml-2 font-mono uppercase tracking-wider">Beats</span>
            <span className="text-neon font-mono font-semibold text-sm">92.00%</span>
          </div>
        </div>
      </div>

      {/* Distribution Chart */}
      <div className="mb-8">
        <div className="panel p-4">
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPercentage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9FEF00" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#9FEF00" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
                <XAxis
                  dataKey="time"
                  tickFormatter={(value) => `${value}ms`}
                  interval={10}
                  tick={{ fontSize: 11, fill: '#A4B1CD' }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                />
                <YAxis
                  tickFormatter={(value) => `${value}%`}
                  tick={{ fontSize: 11, fill: '#A4B1CD' }}
                  domain={[0, 30]}
                  axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                />
                <Tooltip
                  contentStyle={{
                    background: '#111927',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '0.375rem',
                    color: '#E6EDF7',
                  }}
                  formatter={(value: number) => [`${value.toFixed(1)}%`, "Submissions"]}
                  labelFormatter={(label) => `Runtime: ${label}ms`}
                />
                <Area
                  type="monotone"
                  dataKey="percentage"
                  stroke="#9FEF00"
                  fill="url(#colorPercentage)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="flex justify-between text-[10px] font-mono text-htb-text-dim mt-2 px-4 tabular-nums">
          <span>3ms</span>
          <span>56ms</span>
          <span>109ms</span>
          <span>161ms</span>
          <span>214ms</span>
          <span>267ms</span>
        </div>
      </div>

      {/* Code Section */}
      <div className="panel overflow-hidden">
        <div className="flex items-center justify-between p-3 border-b border-htb-border bg-htb-panel/40">
          <div className="flex items-center gap-2">
            <span className="terminal-eyebrow">code</span>
            <Badge variant="info">C++</Badge>
          </div>
        </div>
        <div className="p-4 bg-htb-bg-deep">
          <pre className="text-sm font-mono overflow-x-auto text-neon">
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
        <div className="p-3 border-t border-htb-border">
          <Button variant="outline-dim" className="w-full font-mono text-xs uppercase tracking-widest">
            View More
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AcceptedTab

