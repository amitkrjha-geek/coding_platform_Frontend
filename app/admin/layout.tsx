import type { Metadata } from "next";
import Navbar from "@/components/adminDashboard/Navbar";
import { Sidebar } from "@/components/adminDashboard/Sidebar";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false, nocache: true },
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-htb-bg min-h-screen">
      <Navbar />
      <div className="flex-1 flex">
        <Sidebar />
        <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-x-auto bg-htb-bg">
          {children}
        </div>
      </div>
    </div>
  );
}
