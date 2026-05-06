"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Users,
  CreditCard,
  ShieldPlus,
  CodeXml,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdminAccess } from "@/hooks/useAdminAccess";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin", restricted: true },
  { icon: CodeXml, label: "Challenges", href: "/admin/challenges" },
  { icon: ShieldPlus, label: "Administrator", href: "/admin/administrator" },
  { icon: Users, label: "Users", href: "/admin/users" },
  { icon: CreditCard, label: "Plan & Billing", href: "/admin/plan-billing" },
];

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { isPrivilegedAdmin } = useAdminAccess();
  const visibleNavItems = navItems.filter(
    (item) => !item.restricted || isPrivilegedAdmin
  );

  const isActiveRoute = (href: string) => {
    if (href === '/admin' && pathname === '/admin') {
      return true;
    }
    return pathname.startsWith(href) && href !== '/admin';
  };

  return (
    <div className="relative h-[calc(100vh-3.5rem)]">
      <div
        className={cn(
          "h-full bg-htb-panel border-r border-htb-border transition-all duration-300 ease-in-out z-40",
          isCollapsed ? "w-[64px]" : "w-[240px]"
        )}
      >
        {/* Eyebrow */}
        {!isCollapsed && (
          <div className="px-4 pt-4 pb-2">
            <span className="terminal-eyebrow">admin.console</span>
          </div>
        )}

        {/* Navigation Items */}
        <nav className={cn("p-2", isCollapsed ? "pt-4" : "pt-1")}>
          {visibleNavItems.map((item) => {
            const active = isActiveRoute(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "group relative flex items-center w-full gap-3 mb-1 transition-all rounded-md font-mono text-[11px] uppercase tracking-widest font-semibold",
                  isCollapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5",
                  active
                    ? "bg-neon/10 text-neon border border-neon/30 shadow-neon-sm"
                    : "text-htb-muted border border-transparent hover:border-htb-border hover:text-htb-text hover:bg-htb-panel-hover"
                )}
                title={isCollapsed ? item.label : undefined}
              >
                {/* active rail */}
                {active && !isCollapsed && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r bg-neon shadow-neon-sm" />
                )}
                <item.icon
                  size={18}
                  className={cn(
                    "shrink-0",
                    active ? "text-neon" : "text-htb-text-dim group-hover:text-htb-text"
                  )}
                />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse Button */}
        <button
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute -right-3 top-20 h-6 w-6 rounded-full bg-htb-panel border border-htb-border text-htb-muted hover:text-neon hover:border-neon/40 hover:shadow-neon-sm transition-all flex items-center justify-center"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
    </div>
  );
};
