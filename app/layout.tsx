import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import {
  ClerkProvider
} from '@clerk/nextjs'
import StoreProvider from "./StoreProvider";
import Navbar from "@/components/shared/Navbar";
import MarketingFooter from "@/components/landing/MarketingFooter";

// Derive the API host from the env so preconnect points at the real backend
function getApiOrigin(): string | null {
  const raw = process.env.NEXT_PUBLIC_API_END_POINTS;
  if (!raw) return null;
  try {
    return new URL(raw).origin;
  } catch {
    return null;
  }
}
const API_ORIGIN = getApiOrigin();

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.violethat.com"
  ),
  title: {
    default: "Violethat — Where Blue Teams Play With Hooks",
    template: "%s | Violethat",
  },
  description:
    "A hands-on cybersecurity training platform for detection engineers, blue teamers, and security researchers. Write C/C++ in the browser, run a live agent against the target, capture flags in real time.",
  applicationName: "Violethat",
  keywords: [
    "cybersecurity training",
    "detection engineering",
    "blue team training",
    "malware analysis",
    "security research",
    "CTF platform",
    "capture the flag",
    "hands-on security labs",
    "browser IDE",
    "Violethat",
    "Detect-DB",
  ],
  authors: [{ name: "Violethat" }],
  creator: "Violethat",
  publisher: "Violethat",
  formatDetection: { email: false, address: false, telephone: false },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Violethat",
    locale: "en_US",
    url: "/",
    title:
      "Violethat — The First Platform Where Blue Teams Finally Get to Play With Hooks",
    description:
      "Hands-on cybersecurity training for detection engineers, blue teamers, and security researchers. Browser-native IDE. Live agent runner. Real flag capture.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@violethat",
    creator: "@violethat",
    title:
      "Violethat — The First Platform Where Blue Teams Finally Get to Play With Hooks",
    description:
      "Hands-on cybersecurity training for detection engineers, blue teamers, and security researchers.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "technology",
  // Google Search Console site verification
  verification: {
    google: "AnXM2SQanTYucdAnYar0lPBqq_bDM9WyydrILRngOxI",
  },
  // Headquartered in Goa, India — but available worldwide (see Organization JSON-LD)
  other: {
    "geo.region": "IN-GA",
    "geo.placename": "Goa, India",
    "geo.position": "15.5736;73.7370",
    "ICBM": "15.5736, 73.7370",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#A855F7",
          colorBackground: "#0B0F17",
          colorInputBackground: "#111927",
          colorInputText: "#E6EDF7",
          colorText: "#E6EDF7",
          colorTextSecondary: "#A4B1CD",
          colorNeutral: "#A4B1CD",
          colorDanger: "#FF3E3E",
          colorSuccess: "#A855F7",
          colorWarning: "#FFAF00",
          fontFamily: "var(--font-geist-sans), Manrope, system-ui, sans-serif",
          borderRadius: "0.5rem",
        },
        elements: {
          card: "bg-htb-panel border border-htb-border shadow-panel-lg",
          headerTitle: "text-htb-text",
          headerSubtitle: "text-htb-muted",
          socialButtonsBlockButton:
            "border border-htb-border bg-htb-panel hover:bg-htb-panel-hover text-htb-text",
          formButtonPrimary:
            "bg-neon hover:bg-neon-green-dim text-white font-semibold",
          formFieldInput:
            "bg-htb-panel border border-htb-border text-htb-text focus:border-neon",
          footerActionLink: "text-neon hover:text-neon-green-dim",
        },
      }}
    >
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* Preconnect to backend API so the first /api/* fetch saves TCP+TLS handshake */}
        {API_ORIGIN && (
          <>
            <link rel="preconnect" href={API_ORIGIN} crossOrigin="anonymous" />
            <link rel="dns-prefetch" href={API_ORIGIN} />
          </>
        )}
        {/* Preconnect to analytics endpoints */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.clarity.ms" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased m-0 p-0 box-border min-h-screen bg-htb-bg text-htb-text`}
      >
        <StoreProvider>
          <Navbar />
          <div className="relative flex flex-col min-h-screen">
            {children}
          </div>
          <MarketingFooter />
        </StoreProvider>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            style: {
              background: "#111927",
              color: "#E6EDF7",
              border: "1px solid rgba(255,255,255,0.06)",
              fontFamily: "var(--font-geist-sans), Manrope, sans-serif",
            },
            success: {
              iconTheme: { primary: "#A855F7", secondary: "#0B0F17" },
            },
            error: {
              iconTheme: { primary: "#FF3E3E", secondary: "#0B0F17" },
            },
          }}
        />

        {/* Microsoft Clarity — session replay + heatmaps */}
        <Script id="ms-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "wtg2a3azpz");`}
        </Script>

        {/* Google Analytics 4 — gtag.js */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-F95K16NQWR"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-F95K16NQWR');`}
        </Script>
      </body>
    </html>
    </ClerkProvider>
  );
}
