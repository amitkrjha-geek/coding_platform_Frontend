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
    <ClerkProvider>
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased m-0 p-0 box-border`}
      >
       
          <StoreProvider>
          <Navbar />
          <div className=" overflow-hidden flex flex-col">
            {children}
          </div>
        </StoreProvider>
        <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
    </ClerkProvider>
  );
}
