"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { v4 as uuid } from 'uuid';

// Types for log data
interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'success' | 'warning' | 'error';
  message: string;
  type: 'connection' | 'command' | 'vm-response' | 'result' | 'error';
  sessionId?: string;
}

interface LogsTabProps {
  sessionId?: string;
  isConnected?: boolean;
}

const LogsTab = ({ sessionId, isConnected = false }: LogsTabProps) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<any>(null);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (autoScroll && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  // Initialize Socket.IO connection
  useEffect(() => {
    if (!sessionId) {
      // Disconnect existing socket if no sessionId
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsSocketConnected(false);
      }
      return;
    }

    // Dynamic import to avoid SSR issues
    const initSocket = async () => {
      try {
        const { io } = await import('socket.io-client');
        
        const socket = io(process.env.NEXT_PUBLIC_API_END_POINTS || 'http://localhost:8080', {
          transports: ['websocket', 'polling']
        });

        socketRef.current = socket;

        socket.on('connect', () => {
          // console.log('🔌 Connected to Socket.IO server');
          setIsSocketConnected(true);
          socket.emit('join-session', sessionId);
        });

        socket.on('disconnect', () => {
          // console.log('🔌 Disconnected from Socket.IO server');
          setIsSocketConnected(false);
        });

        socket.on('log-message', (logData: Omit<LogEntry, 'id'>) => {
          setLogs(prev => {
            // 1. Check if we have logs
            if (prev.length > 0) {
              const lastLog = prev[prev.length - 1];
              
              // 2. Compare the new log with the last log
              // If the message and timestamp are identical, it's a duplicate -> Ignore it
              if (lastLog.message === logData.message && 
                  lastLog.timestamp === logData.timestamp) {
                return prev;
              }
            }

            // 3. If unique, add it
            const newLog: LogEntry = {
              ...logData,
              id: uuid()
            };
            return [...prev, newLog];
          });
        });

        socket.on('connect_error', (error: any) => {
          console.error('❌ Socket.IO connection error:', error);
          setIsSocketConnected(false);
        });

      } catch (error) {
        console.error('❌ Error initializing Socket.IO:', error);
      }
    };

    initSocket();

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.emit('leave-session', sessionId);
        socketRef.current.off('log-message');
        socketRef.current.disconnect();
      }
    };
  }, [sessionId]);

  // Clear logs function
  const clearLogs = () => {
    setLogs([]);
  };

  // Get log level styling
  const getLogLevelStyle = (level: LogEntry['level']) => {
    switch (level) {
      case 'success':
        return 'text-neon bg-neon/10 border-neon/30';
      case 'warning':
        return 'text-warn bg-warn/10 border-warn/30';
      case 'error':
        return 'text-danger bg-danger/10 border-danger/30';
      default:
        return 'text-htb-muted bg-htb-panel-2 border-htb-border';
    }
  };

  // Get log type icon
  const getLogTypeIcon = (type: LogEntry['type']) => {
    switch (type) {
      case 'connection':
        return '◇';
      case 'command':
        return '$';
      case 'vm-response':
        return '←';
      case 'result':
        return '✓';
      case 'error':
        return '✗';
      default:
        return '›';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full"
    >
      {/* Header with controls */}
      <div className="flex items-center justify-between p-3 border-b border-htb-border bg-htb-panel/40 -mx-6 -mt-4 px-6 mb-3">
        <div className="flex items-center gap-3">
          <span className="terminal-eyebrow inline-flex items-center gap-2">
            <span className={`inline-block w-1.5 h-1.5 rounded-full ${isSocketConnected ? 'bg-neon shadow-neon-sm animate-glow-pulse' : 'bg-danger'}`} />
            {isSocketConnected ? 'Connected' : 'Disconnected'}
          </span>
          {sessionId && (
            <span className="text-[10px] text-htb-text-dim font-mono uppercase tracking-wider">
              Session: <span className="text-htb-muted">{sessionId.slice(0, 12)}...</span>
            </span>
          )}
        </div>
      </div>

      {/* Logs container */}
      <div className="bg-htb-bg-deep border border-htb-border rounded-md overflow-hidden">
        <div className="font-mono text-xs leading-relaxed">
          {logs.length === 0 ? (
            <div className="text-center text-htb-text-dim py-12 px-4">
              <div className="terminal-eyebrow mb-2 justify-center">awaiting.stream</div>
              <p className="text-sm">
                {isSocketConnected ? 'Waiting for logs...' : 'Not connected to log stream'}
              </p>
              {isSocketConnected && (
                <span aria-hidden className="inline-block w-1.5 h-3 bg-neon align-middle animate-terminal-blink mt-2" />
              )}
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className={`group hover:bg-neon/5 py-1.5 px-3 transition-colors break-all border-l-2 ${
                  log.level === 'error' ? 'border-danger/60' :
                  log.level === 'warning' ? 'border-warn/60' :
                  log.level === 'success' ? 'border-neon/60' :
                  'border-htb-border'
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className={`shrink-0 w-4 text-center ${
                    log.level === 'error' ? 'text-danger' :
                    log.level === 'warning' ? 'text-warn' :
                    log.level === 'success' ? 'text-neon' :
                    'text-htb-text-dim'
                  }`}>{getLogTypeIcon(log.type)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] text-htb-text-dim tabular-nums">
                        [{new Date(log.timestamp).toLocaleTimeString()}]
                      </span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider border ${getLogLevelStyle(log.level)}`}>
                        {log.level}
                      </span>
                    </div>
                    <div className="text-htb-text whitespace-pre-wrap">
                      {log.message}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={logsEndRef} />
        </div>
      </div>
    </motion.div>
  )
}

export default LogsTab