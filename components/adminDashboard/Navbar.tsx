import React from "react";
import { Bell, Terminal } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  return (
    <nav className="w-full bg-htb-panel border-b border-htb-border h-14 flex">
      <div className="w-full h-full flex justify-between items-center px-6 lg:px-10">
        <div className="flex items-center gap-3">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <span className="relative flex items-center justify-center w-7 h-7 rounded border border-neon/30 bg-neon/5 group-hover:border-neon group-hover:bg-neon/10 transition-colors">
              <Terminal className="w-3.5 h-3.5 text-neon" />
            </span>
            <h1 className="text-base font-bold tracking-tight text-htb-text">
              Vio<span className="text-neon">_</span>ethat
            </h1>
          </Link>
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded border border-neon/30 bg-neon/10 text-neon font-mono text-[10px] font-semibold uppercase tracking-widest">
            Admin
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            aria-label="Notifications"
            className="relative flex items-center justify-center w-9 h-9 rounded-md border border-htb-border text-htb-muted hover:text-neon hover:border-neon/40 transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-neon shadow-neon-sm" />
          </button>
          <Link href="#" className="block">
            <div className="relative w-9 h-9 rounded-full overflow-hidden ring-1 ring-neon/30 hover:ring-neon transition-all">
              <Image
                src="https://github.com/shadcn.png"
                alt="Profile"
                fill
                className="object-cover cursor-pointer"
              />
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
