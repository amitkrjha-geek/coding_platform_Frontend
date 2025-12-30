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
          console.log('🔌 Connected to Socket.IO server');
          setIsSocketConnected(true);
          socket.emit('join-session', sessionId);
        });

        socket.on('disconnect', () => {
          console.log('🔌 Disconnected from Socket.IO server');
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
        return 'text-green-600 bg-green-50';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50';
      case 'error':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  // Get log type icon
  const getLogTypeIcon = (type: LogEntry['type']) => {
    switch (type) {
      case 'connection':
        return '🔌';
      case 'command':
        return '⚡';
      case 'vm-response':
        return '📥';
      case 'result':
        return '✅';
      case 'error':
        return '❌';
      default:
        return '📝';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="w-full bg-white rounded-lg shadow-sm"
    >
      {/* Header with controls */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isSocketConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm font-medium text-gray-700">
              {isSocketConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          {sessionId && (
            <span className="text-xs text-gray-500 font-mono">
              Session: {sessionId}
            </span>
          )}
        </div>
      </div>

      {/* Logs container */}
      <div className="">
        <div className="font-mono text-sm leading-relaxed">
          {logs.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              {isSocketConnected ? 'Waiting for logs...' : 'Not connected to log stream'}
            </div>
          ) : (
            logs.map((log) => (
              <div 
                key={log.id} 
                className={`hover:bg-gray-50 py-2 px-3 transition-colors break-all border-l-2 ${
                  log.level === 'error' ? 'border-red-300' : 
                  log.level === 'warning' ? 'border-yellow-300' : 
                  log.level === 'success' ? 'border-green-300' : 
                  'border-gray-300'
                }`}
              >
                <div className="flex items-start space-x-2">
                  <span className="text-lg">{getLogTypeIcon(log.type)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs text-gray-500">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getLogLevelStyle(log.level)}`}>
                        {log.level.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-gray-800 whitespace-pre-wrap">
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