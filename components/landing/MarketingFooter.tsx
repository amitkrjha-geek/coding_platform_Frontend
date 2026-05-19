import Link from "next/link";
import { Terminal, Github, Twitter, Linkedin, Mail } from "lucide-react";
import Image from "next/image";

const platform = [
  { href: "/challenges", label: "Challenges" },
  { href: "/billing", label: "Pricing" },
  { href: "/about", label: "About Us" },
];


const legal = [
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" }
];

const connect = [
  { href: "https://twitter.com/violethat", label: "Twitter", icon: Twitter },
  { href: "https://github.com/violethat", label: "GitHub", icon: Github },
  {
    href: "https://linkedin.com/company/violethat",
    label: "LinkedIn",
    icon: Linkedin,
  },
  { href: "mailto:violethat@violethat.com", label: "Email", icon: Mail },
];

function Column({
  heading,
  items,
}: {
  heading: string;
  items: { href: string; label: string }[];
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-[10px] font-mono uppercase tracking-widest font-semibold text-htb-text-dim">
        {heading}
      </h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="text-sm text-htb-muted hover:text-neon transition-colors"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function MarketingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-htb-border bg-htb-bg-deep">
      {/* Top accent line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14 lg:py-20">
        {/* Top: 5-column nav */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-10">
          {/* Brand column */}
          <div className="col-span-2 lg:col-span-2 space-y-4">
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
            <p className="text-sm text-htb-muted leading-relaxed max-w-xs">
              Know Your Defense. Train Your Offense.
            </p>
            <p className="text-xs text-htb-text-dim font-mono uppercase tracking-widest">
             
House 731, Pinto Heritage Villa, Dmello Vaddo, Anjuna, Goa-403509
            </p>
          </div>

          <Column heading="Platform" items={platform} />
          <Column heading="Legal" items={legal} />
        </div>

        {/* Divider */}
        <div className="mt-12 pt-6 border-t border-htb-border">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Bottom-left: copyright + status */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
              <p className="text-xs text-htb-text-dim">
                © {year} Violethat. All rights reserved.
              </p>
              <span className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-htb-muted">
                <span className="block w-1.5 h-1.5 rounded-full bg-neon shadow-neon-sm animate-glow-pulse" />
                All systems operational
              </span>
            </div>

            {/* Bottom-right: connect icons + mono version */}
            <div className="flex items-center gap-4">
              <ul className="flex items-center gap-2">
                {connect.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      aria-label={item.label}
                      className="flex items-center justify-center w-8 h-8 rounded-md border border-htb-border text-htb-muted hover:text-neon hover:border-neon/40 transition-colors"
                      target={
                        item.href.startsWith("http") ? "_blank" : undefined
                      }
                      rel={
                        item.href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                    >
                      <item.icon className="w-3.5 h-3.5" />
                    </a>
                  </li>
                ))}
              </ul>
              <span className="hidden sm:inline text-[11px] font-mono uppercase tracking-widest text-htb-text-dim">
                $ violethat --version 1.0.0
              </span>
            </div>
          </div>

          {/* Credit line */}
          <div className="mt-6 pt-4 border-t border-htb-border/60 text-center">
            <p className="text-[11px] font-mono uppercase tracking-widest text-htb-text-dim">
              Website Designed &amp; Developed by{" "}
              <a
                href="https://pathnovo.com/"
                target="_blank"
                rel="noopener"
                className="text-htb-muted hover:text-neon transition-colors font-semibold"
              >
                Pathnovo
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
