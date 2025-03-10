import Navbar from "@/components/adminDashboard/Navbar";
import { Sidebar } from "@/components/adminDashboard/Sidebar";


export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   <div>
    <Navbar/>
   
       <div className="flex-1 flex">
       
       <Sidebar/>
       <div className=" h-[calc(100vh-3.5rem)] flex-1 overflow-x-auto">
       {children}
       </div>
       
       
    </div>
    </div>
  );
}
