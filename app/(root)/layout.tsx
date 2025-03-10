import Navbar from "@/components/shared/Navbar";


export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <div className="mt-14">
        {children}
      </div>
    </>
  );
}
