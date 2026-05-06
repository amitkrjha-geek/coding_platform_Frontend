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
];

const NotificationsPage = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
                <div className="mb-6">
                    <span className="terminal-eyebrow">notifications.feed</span>
                    <h1 className="heading-display text-3xl text-htb-text mt-1">
                        Notifications
                    </h1>
                </div>
                <div className="panel overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-3 border-b border-htb-border bg-htb-bg/40">
                        <span className="terminal-eyebrow">inbox</span>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-htb-text-dim">
                            {notifications.length} items
                        </span>
                    </div>
                    {notifications.map((notification) => {
                        const isTrophy = notification.icon === 'trophy';
                        return (
                            <div
                                key={notification.id}
                                className="group flex items-start gap-3 px-5 py-4 hover:bg-neon/5 cursor-pointer border-b border-htb-border last:border-0 transition-colors"
                            >
                                <div
                                    className={`shrink-0 mt-0.5 flex items-center justify-center w-9 h-9 rounded-md border ${
                                        isTrophy
                                            ? 'border-warn/30 bg-warn/10 text-warn'
                                            : 'border-neon/30 bg-neon/10 text-neon'
                                    }`}
                                >
                                    {isTrophy ? <Trophy size={16} /> : <Info size={16} />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-htb-text leading-snug">
                                        {notification.message}
                                    </p>
                                    <p className="text-[11px] font-mono uppercase tracking-widest text-htb-text-dim mt-1">
                                        {notification.timeAgo}
                                    </p>
                                </div>
                                {notification.points && (
                                    <div className="shrink-0 inline-flex items-center px-2 py-1 rounded-full border border-neon/30 bg-neon/10 font-mono text-[11px] font-semibold text-neon">
                                        +{notification.points.replace('+', '')}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </motion.div>
        </div>
    );
};

export default NotificationsPage;
