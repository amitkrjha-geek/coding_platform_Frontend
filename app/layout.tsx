import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import {
  ClerkProvider
} from '@clerk/nextjs'
import StoreProvider from "./StoreProvider";
import Navbar from "@/components/shared/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Violethat",
  description: "Violethat is a coding platform that allows you to code in your browser.",
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
          colorPrimary: "#9FEF00",
          colorBackground: "#0B0F17",
          colorInputBackground: "#111927",
          colorInputText: "#E6EDF7",
          colorText: "#E6EDF7",
          colorTextSecondary: "#A4B1CD",
          colorNeutral: "#A4B1CD",
          colorDanger: "#FF3E3E",
          colorSuccess: "#9FEF00",
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
            "bg-neon hover:bg-neon-green-dim text-htb-bg font-semibold",
          formFieldInput:
            "bg-htb-panel border border-htb-border text-htb-text focus:border-neon",
          footerActionLink: "text-neon hover:text-neon-green-dim",
        },
      }}
    >
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased m-0 p-0 box-border min-h-screen bg-htb-bg text-htb-text`}
      >
        <StoreProvider>
          <Navbar />
          <div className="relative flex flex-col min-h-screen">
            {children}
          </div>
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
              iconTheme: { primary: "#9FEF00", secondary: "#0B0F17" },
            },
            error: {
              iconTheme: { primary: "#FF3E3E", secondary: "#0B0F17" },
            },
          }}
        />
      </body>
    </html>
    </ClerkProvider>
  );
}
