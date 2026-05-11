import React from 'react'

const Loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-htb-bg">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon shadow-neon-sm"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-neon animate-glow-pulse"></div>
          </div>
        </div>
        <div className="font-mono text-[11px] uppercase tracking-widest text-htb-muted flex items-center gap-2">
          <span>Loading</span>
          <span aria-hidden className="inline-block w-1.5 h-3 bg-neon align-middle animate-terminal-blink" />
        </div>
      </div>
    </div>
  )
}

export default Loading
