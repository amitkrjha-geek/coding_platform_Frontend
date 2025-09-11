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
    <section className="bg-[#f9f9f9] h-50 p-3">
      <div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/users">Users</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>User Profile</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div>
      <ProfilePage  />
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