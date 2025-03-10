"use client";

import { Trophy, Info } from "lucide-react";
import { motion } from "framer-motion";

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
    // Add more notifications...
];

const NotificationsPage = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <h1 className="text-2xl font-semibold mb-6">Notifications</h1>
                <div className="bg-white rounded-xl shadow-sm">
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
            </motion.div>
        </div>
    );
};

export default NotificationsPage;