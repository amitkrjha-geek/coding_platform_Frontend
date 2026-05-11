'use client'
import React, { useEffect, Suspense } from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import UpdateCouponForm from '@/components/adminDashboard/plan&Billing/EditCoupon';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { fetchCouponById } from '@/redux/features/couponSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';

const PageContent = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  
  const dispatch = useAppDispatch();

  const { couponById: data } = useAppSelector((state: RootState) => state.coupon);

  useEffect(() => {
    if (id) {
      dispatch(fetchCouponById(id))
        .unwrap()
        .catch(() => toast.error("Failed to fetch coupon details!"));
    }
  }, [dispatch, id]);

  if (!data) return <div className="p-7 text-htb-text-dim font-mono uppercase tracking-widest">Loading...</div>

  const transformedPlan = {
    _id: data?._id,
    code: data?.code,
    category: data?.category,
    discountAmount: data?.discountAmount ?? 0,
    // discountPercent: data?.discountPercent ?? 0,
    // maxCap: data?.maxCap ?? 0,
    details: data?.details,
  };

  
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
              <BreadcrumbPage className="text-neon font-mono text-xs uppercase tracking-widest">Edit Coupon</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="mt-3 mb-5">
        <span className="terminal-eyebrow">edit.coupon</span>
        <h1 className="heading-display text-2xl text-htb-text mt-1">Edit Coupon</h1>
      </div>
      <div>
        <UpdateCouponForm initialData={transformedPlan} />
      </div>
    </section>
  )
}

const Page = () => {
  return (
    <Suspense fallback={<div className="p-7 text-htb-text-dim font-mono uppercase tracking-widest">Loading...</div>}>
      <PageContent />
    </Suspense>
  );
};

export default Page