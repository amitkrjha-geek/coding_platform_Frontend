'use client'
import React from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import CouponForm from '@/components/adminDashboard/plan&Billing/CouponForm';

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
              <BreadcrumbLink href="/admin/plan-billing" className="text-htb-muted hover:text-neon font-mono text-xs uppercase tracking-widest">Subscription</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-htb-text-dim" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-neon font-mono text-xs uppercase tracking-widest">Add Coupon</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="mt-3 mb-5">
        <span className="terminal-eyebrow">add.coupon</span>
        <h1 className="heading-display text-2xl text-htb-text mt-1">Add Coupon</h1>
      </div>
      <div>
        <CouponForm />
      </div>
    </section>
  )
}

export default Page