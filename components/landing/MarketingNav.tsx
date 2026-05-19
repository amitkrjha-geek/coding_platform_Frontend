"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useAuth, UserButton } from "@clerk/nextjs";
import { useCheckRole } from "@/hooks/useCheckRole";
import { useAdminAccess } from "@/hooks/useAdminAccess";
import { getCurrentUserId } from "@/config/token";

const navLinks = [
  { href: "/#platform", label: "Platform" },
  { href: "/challenges", label: "Challenges" },
  { href: "/#pricing", label: "Pricing" },
];

export default function MarketingNav() {
  const { userId } = useAuth();
  const { checkUserRole } = useCheckRole();
  const { isPrivilegedAdmin } = useAdminAccess();
  const pathname = usePathname();
  const role = checkUserRole();
  const dashboardHref = isPrivilegedAdmin ? "/admin" : "/admin/challenges";
  const currentUserId = getCurrentUserId();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
  }, [isMenuOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="fixed top-0 z-50 w-full h-16 px-4 sm:px-6 lg:px-10 flex items-center justify-between border-b border-htb-border bg-htb-bg/70 backdrop-blur-xl supports-[backdrop-filter]:bg-htb-bg/60"
      >
        {/* Top scanline (mount-only, runs via Tailwind animate-shine) */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon/60 to-transparent animate-shine"
        />

        {/* Left: logo */}
           <Link
          href="/"
          aria-label="Violethat — Home"
          className="flex items-center gap-2 group shrink-0"
        >
          <span className="relative flex items-center justify-center w-9 h-9  transition-colors">
            <Image
              src="/VioletHat Logo_Emblen_Violet.svg"
              alt=""
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

        {/* Center: nav links */}
        <nav
          aria-label="Primary"
          className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2"
        >
          {navLinks.map((link) => {
            const isActive =
              link.href.startsWith("/#")
                ? false
                : pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(link.href));
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
                    layoutId="marketingNavIndicator"
                    className="absolute -bottom-[17px] left-2 right-2 h-0.5 bg-neon shadow-neon-sm"
                    initial={false}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: auth/user actions */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          {mounted && userId ? (
            <>
              <Link
                href={`/profile?id=${currentUserId}`}
                className="px-3 py-1.5 rounded-md border border-htb-border bg-htb-panel text-xs font-mono uppercase tracking-widest text-htb-muted hover:border-neon/40 hover:text-neon transition-colors"
              >
                Profile
              </Link>

              {role === "admin" && (
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
                Sign In
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

        {/* Mobile: avatar (if logged in) / Sign In + hamburger */}
        <div className="flex items-center gap-3 lg:hidden">
          {mounted && userId ? (
            <UserButton />
          ) : (
            <Link
              href="/sign-in"
              className="px-3 py-1.5 rounded-md text-xs font-mono uppercase tracking-widest text-htb-muted hover:text-neon transition-colors"
            >
              Sign In
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

      {/* Mobile drawer */}
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

                <nav aria-label="Mobile" className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-3 rounded-md font-mono text-xs uppercase tracking-widest text-htb-muted border border-transparent hover:border-htb-border hover:text-htb-text transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}

                  {mounted && userId ? (
                    <>
                      <Link
                        href={`/profile?id=${currentUserId}`}
                        onClick={() => setIsMenuOpen(false)}
                        className="mt-2 block px-4 py-3 rounded-md font-mono text-xs uppercase tracking-widest text-htb-muted border border-transparent hover:border-htb-border hover:text-htb-text transition-colors"
                      >
                        Profile
                      </Link>
                      {role === "admin" && (
                        <Link
                          href={dashboardHref}
                          onClick={() => setIsMenuOpen(false)}
                          className="mt-2 block px-4 py-3 rounded-md bg-neon text-white font-mono text-xs uppercase tracking-widest font-semibold text-center hover:shadow-neon-sm transition-all"
                        >
                          Dashboard
                        </Link>
                      )}
                    </>
                  ) : (
                    <Link
                      href="/sign-up"
                      onClick={() => setIsMenuOpen(false)}
                      className="mt-3 block px-4 py-3 rounded-md bg-neon text-white font-mono text-xs uppercase tracking-widest font-semibold text-center hover:shadow-neon-sm transition-all"
                    >
                      Sign Up
                    </Link>
                  )}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
