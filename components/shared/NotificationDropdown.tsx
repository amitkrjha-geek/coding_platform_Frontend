"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Info } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

interface Notification {
  id: string;
  icon: "trophy" | "info";
  message: string;
  points?: string;
  timeAgo: string;
}

const notifications: Notification[] = [
  {
    id: "1",
    icon: "info",
    message: "Completed a profile field: Birthday",
    points: "+2",
    timeAgo: "7 minutes ago"
  },
  {
    id: "2",
    icon: "info",
    message: "Completed a profile field: Education",
    points: "+5",
    timeAgo: "7 minutes ago"
  },
  {
    id: "3",
    icon: "trophy",
    message: "Biweekly Contest 143 and Weekly Contest 423 are approaching.",
    timeAgo: "3 months ago"
  },
  {
    id: "4",
    icon: "trophy",
    message: "Weekly Contest 422 is approaching.",
    timeAgo: "3 months ago"
  }
];

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationDropdown = ({ isOpen, onClose }: NotificationDropdownProps) => {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleViewAll = () => {
    onClose();
    router.push('/notifications');
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40"
          />

          {/* Dropdown */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-full right-0 mt-3 w-[22rem] sm:w-96 rounded-lg border border-htb-border bg-htb-panel shadow-panel-lg z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-htb-border bg-htb-bg/40">
              <span className="terminal-eyebrow">Notifications</span>
              <span className="text-[10px] font-mono text-htb-text-dim uppercase tracking-widest">
                {notifications.length} new
              </span>
            </div>

            <div className="max-h-[420px] overflow-y-auto scrollbar-hide">
              {notifications.map((notification) => {
                const isTrophy = notification.icon === 'trophy';
                return (
                  <div
                    key={notification.id}
                    className="group relative flex items-start gap-3 px-4 py-3 cursor-pointer border-b border-htb-border last:border-0 hover:bg-neon/5 transition-colors"
                  >
                    {/* unread dot */}
                    <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-neon shadow-neon-sm opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div
                      className={`shrink-0 mt-0.5 flex items-center justify-center w-8 h-8 rounded-md border ${
                        isTrophy
                          ? 'border-warn/30 bg-warn/10 text-warn'
                          : 'border-neon/30 bg-neon/10 text-neon'
                      }`}
                    >
                      {isTrophy ? <Trophy size={14} /> : <Info size={14} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-htb-text leading-snug">{notification.message}</p>
                      <p className="text-[11px] font-mono uppercase tracking-wider text-htb-text-dim mt-1">
                        {notification.timeAgo}
                      </p>
                    </div>
                    {notification.points && (
                      <div className="shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-full border border-neon/30 bg-neon/10 font-mono text-[11px] font-semibold text-neon">
                        +{notification.points.replace('+', '')}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="p-2 border-t border-htb-border">
              <button
                onClick={handleViewAll}
                className="w-full text-center text-[11px] font-mono uppercase tracking-widest text-htb-muted hover:text-neon py-2 rounded-md hover:bg-neon/5 transition-colors"
              >
                View all notifications
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationDropdown;
