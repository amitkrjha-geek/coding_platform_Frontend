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

  if (!data) return <div>Loading...</div>

  const transformedPlan = {
    _id: data?._id,
    code: data?.code,
    category: data?.category,
    discountAmount: data?.discountAmount ?? 0,
    discountPercent: data?.discountPercent ?? 0,
    maxCap: data?.maxCap ?? 0,
    details: data?.details,
  };

  
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
              <BreadcrumbLink href="/admin/plan-billing">Subscription</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Edit Coupon</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

 <h1 className="heading1 mt-2">Edit Coupon</h1>
      <div>
      <UpdateCouponForm initialData={transformedPlan} />
      </div>

    </section>
  )
}

const Page = () => {
  return (
    <Suspense fallback={<div className="p-7">Loading...</div>}>
      <PageContent />
    </Suspense>
  );
};

export default Page