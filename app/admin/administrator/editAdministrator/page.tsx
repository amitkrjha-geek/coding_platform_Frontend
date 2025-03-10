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
    <section className="bg-[#f9f9f9] h-50 p-7">
      <div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/administrator">Administrator</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Edit Administrator</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <h1 className="heading1 mt-2">Edit Administrator</h1>

      <Suspense fallback={<div>Loading...</div>}>
        <AdminContent />
      </Suspense>
    </section>
  );
};

export default Page;
