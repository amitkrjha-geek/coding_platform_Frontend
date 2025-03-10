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
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
          >
            <div className="max-h-[480px] overflow-y-auto scrollbar-hide">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start gap-3 p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                >
                  <div className={`shrink-0 mt-1 ${notification.icon === 'trophy' ? 'text-amber-400' : 'text-purple'}`}>
                    {notification.icon === 'trophy' ? <Trophy size={20} /> : <Info size={20} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.timeAgo}</p>
                  </div>
                  {notification.points && (
                    <div className="shrink-0 flex items-center gap-1">
                      <span className="text-amber-400 text-sm">+</span>
                      <span className="bg-amber-400 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {notification.points.replace('+', '')}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="p-3 text-center border-t border-gray-100">
              <button
                onClick={handleViewAll}
                className="text-sm text-gray-500 hover:text-purple"
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