"use client";

import React, { useState } from 'react'
import { Menu, X, Terminal } from "lucide-react";
import Link from 'next/link';
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from 'next/navigation';
import Image from "next/image";
import NotificationDropdown from "./NotificationDropdown";
import { useAuth, UserButton, useUser } from '@clerk/nextjs';
import { useCheckRole } from '@/hooks/useCheckRole';
import { useAdminAccess } from '@/hooks/useAdminAccess';
import { getCurrentUserId } from '@/config/token';

export default function Navbar() {
    const { user } = useUser();
    const id = getCurrentUserId();
    const name = user?.fullName || 'User';
    const avatar = user?.imageUrl || 'https://github.com/shadcn.png';
    const email = user?.emailAddresses[0].emailAddress || 'User@example.com';

    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const pathname = usePathname();
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { checkUserRole } = useCheckRole();
    const { isPrivilegedAdmin } = useAdminAccess();

    const role = checkUserRole();
    const dashboardHref = isPrivilegedAdmin ? '/admin' : '/admin/challenges';

    const { userId } = useAuth();

    React.useEffect(() => {
        setMounted(true);
    }, []);

    React.useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMenuOpen]);

    const navLinks = [
        { href: "/challenges", label: "Challenges" },
        { href: "/billing", label: "Billing" },
    ];

    // Marketing routes render their own <MarketingNav/> — hide this global one there
    const isMarketingRoute =
        pathname === "/" ||
        pathname === "/about" ||
        pathname === "/terms" ||
        pathname === "/privacy" ||
        pathname.startsWith("/vs/");
    if (isMarketingRoute) return null;

    return (
        <>
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="fixed top-0 z-50 w-full h-16 px-4 sm:px-6 flex items-center justify-between border-b border-htb-border bg-htb-bg/80 backdrop-blur-xl supports-[backdrop-filter]:bg-htb-bg/60"
            >
                {/* Logo */}
                   <Link
          href="/"
          aria-label="Violethat — Home"
          className="flex items-center gap-2 group shrink-0"
        >
          <span className="relative flex items-center justify-center w-9 h-9  transition-colors">
            <Image
              src="/VioletHat Logo_Emblen_Violet.svg"
              alt="VioletHat logo"
              width={30}
              height={30}
              priority
              className="w-10 h-10"
            />
          </span>
          <span className="text-lg font-bold tracking-tight text-htb-text">
            Vio<span className="text-neon">£</span>ethat
          </span>
        </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="relative px-4 py-2 group"
                            >
                                <span
                                    className={`text-xs font-mono uppercase tracking-widest transition-colors ${
                                        isActive
                                            ? "text-neon"
                                            : "text-htb-muted group-hover:text-htb-text"
                                    }`}
                                >
                                    {link.label}
                                </span>
                                {isActive && (
                                    <motion.div
                                        layoutId="navIndicator"
                                        className="absolute -bottom-[17px] left-2 right-2 h-0.5 bg-neon shadow-neon-sm"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Desktop Actions */}
                <div className="hidden lg:flex items-center gap-3">
                    {userId ? (
                        <>
                            <div className="relative">
                                {mounted && (
                                    <NotificationDropdown
                                        isOpen={isNotificationsOpen}
                                        onClose={() => setIsNotificationsOpen(false)}
                                    />
                                )}
                            </div>

                            <Link
                                href={`/profile?id=${id}`}
                                className="px-3 py-1.5 rounded-md border border-htb-border bg-htb-panel text-xs font-mono uppercase tracking-widest text-htb-muted hover:border-neon/40 hover:text-neon transition-colors"
                            >
                                Profile
                            </Link>

                            {role === 'admin' && !pathname.startsWith('/admin') && (
                                <Link
                                    href={dashboardHref}
                                    className="px-3 py-1.5 rounded-md bg-neon text-white text-xs font-mono uppercase tracking-widest font-semibold hover:shadow-neon-sm transition-all hover:-translate-y-0.5"
                                >
                                    Dashboard
                                </Link>
                            )}

                            <div className="flex items-center pl-2 ml-1 border-l border-htb-border h-8">
                                <UserButton />
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link
                                href="/sign-in"
                                className="px-4 py-2 rounded-md text-xs font-mono uppercase tracking-widest text-htb-muted hover:text-neon transition-colors"
                            >
                                Login
                            </Link>
                            <Link
                                href="/sign-up"
                                className="px-4 py-2 rounded-md bg-neon text-white text-xs font-mono uppercase tracking-widest font-semibold hover:shadow-neon-sm transition-all hover:-translate-y-0.5"
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Actions */}
                <div className="flex items-center gap-3 lg:hidden">
                    {userId ? (
                        <UserButton />
                    ) : (
                        <Link
                            href="/sign-in"
                            className="px-3 py-1.5 rounded-md text-xs font-mono uppercase tracking-widest text-htb-muted hover:text-neon transition-colors"
                        >
                            Login
                        </Link>
                    )}

                    <button
                        aria-label="Open menu"
                        className="flex items-center justify-center w-9 h-9 rounded-md border border-htb-border text-htb-muted hover:text-neon hover:border-neon/40 transition-colors"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                </div>
            </motion.header>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.7 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-htb-bg-deep/80 backdrop-blur-sm z-50 lg:hidden"
                            onClick={() => setIsMenuOpen(false)}
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-[300px] bg-htb-panel border-l border-htb-border z-50 lg:hidden"
                        >
                            <div className="p-5">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="terminal-eyebrow">Menu</span>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="text-htb-muted hover:text-neon"
                                    >
                                        <X className="w-5 h-5" />
                                    </motion.button>
                                </div>

                                {userId && (
                                    <Link
                                        href={`/profile?id=${id}`}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center gap-3 mb-6 p-3 rounded-lg border border-htb-border bg-htb-bg hover:border-neon/40 transition-colors"
                                    >
                                        <div className="relative w-10 h-10 rounded-full overflow-hidden ring-1 ring-neon/30">
                                            <Image
                                                src={avatar}
                                                alt="Profile"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-medium text-htb-text truncate">{name}</p>
                                            <p className="text-xs text-htb-text-dim truncate">{email}</p>
                                        </div>
                                    </Link>
                                )}

                                <nav className="flex flex-col gap-1">
                                    {navLinks.map((link) => {
                                        const isActive = pathname === link.href;
                                        return (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                onClick={() => setIsMenuOpen(false)}
                                                className={`block px-4 py-3 rounded-md font-mono text-xs uppercase tracking-widest transition-colors ${
                                                    isActive
                                                        ? 'bg-neon/10 text-neon border border-neon/30'
                                                        : 'text-htb-muted border border-transparent hover:border-htb-border hover:text-htb-text'
                                                }`}
                                            >
                                                {link.label}
                                            </Link>
                                        );
                                    })}

                                    {userId && (
                                        <Link
                                            href={`/profile?id=${id}`}
                                            onClick={() => setIsMenuOpen(false)}
                                            className={`block px-4 py-3 rounded-md font-mono text-xs uppercase tracking-widest transition-colors ${
                                                pathname === '/profile'
                                                    ? 'bg-neon/10 text-neon border border-neon/30'
                                                    : 'text-htb-muted border border-transparent hover:border-htb-border hover:text-htb-text'
                                            }`}
                                        >
                                            Profile
                                        </Link>
                                    )}

                                    {!userId && (
                                        <Link
                                            href="/sign-up"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="mt-3 block px-4 py-3 rounded-md bg-neon text-white font-mono text-xs uppercase tracking-widest font-semibold text-center hover:shadow-neon-sm transition-all"
                                        >
                                            Sign Up
                                        </Link>
                                    )}

                                    {role === 'admin' && !pathname.startsWith('/admin') && (
                                        <Link
                                            href={dashboardHref}
                                            onClick={() => setIsMenuOpen(false)}
                                            className="mt-3 block px-4 py-3 rounded-md bg-neon text-white font-mono text-xs uppercase tracking-widest font-semibold text-center hover:shadow-neon-sm transition-all"
                                        >
                                            Dashboard
                                        </Link>
                                    )}
                                </nav>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
