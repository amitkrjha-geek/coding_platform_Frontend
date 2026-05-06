'use client'
import React, { Suspense } from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ProfilePage from '@/components/adminDashboard/users/UserProfile';
import Loading from '@/components/Loading';

const PageContent = () => {
  
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
              <BreadcrumbLink href="/admin/users" className="text-htb-muted hover:text-neon font-mono text-xs uppercase tracking-widest">Users</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-htb-text-dim" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-neon font-mono text-xs uppercase tracking-widest">User Profile</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="mt-3">
        <ProfilePage />
      </div>
    </section>
  )
}

const Page = () => {
  return (
    <Suspense fallback={<div className="p-5"><Loading /></div>}>
      <PageContent />
    </Suspense>
  );
};

export default Page