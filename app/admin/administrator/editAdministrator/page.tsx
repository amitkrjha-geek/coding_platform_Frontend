"use client";

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import AdminDetails from "@/components/adminDashboard/administrators/AdminDetails";

// Create a client component for the content that uses useSearchParams
const AdminContent = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  return (
    <div className="mt-5">
      <div className="min-w-xl mx-auto">
        {id && <AdminDetails id={id} />}
      </div>
    </div>
  );
};

const Page = () => {
  return (
    <section className="bg-htb-bg min-h-screen p-7">
      <div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin" className="text-htb-muted hover:text-neon font-mono text-xs uppercase tracking-widest">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-htb-text-dim" />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/administrator" className="text-htb-muted hover:text-neon font-mono text-xs uppercase tracking-widest">Administrator</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-htb-text-dim" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-neon font-mono text-xs uppercase tracking-widest">Edit Administrator</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="mt-3 mb-5">
        <span className="terminal-eyebrow">edit.administrator</span>
        <h1 className="heading-display text-2xl text-htb-text mt-1">Edit Administrator</h1>
      </div>

      <Suspense fallback={<div className="text-htb-text-dim font-mono uppercase tracking-widest">Loading...</div>}>
        <AdminContent />
      </Suspense>
    </section>
  );
};

export default Page;
