"use client";
import React, { useEffect, Suspense } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import EditPlanForm from "@/components/adminDashboard/plan&Billing/EditPlan";
import { useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { fetchPlanById } from "@/redux/features/planSlice";
import toast from "react-hot-toast";

const PageContent = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const dispatch = useAppDispatch();
  const { planById: data } = useAppSelector((state: RootState) => state.plan);

  useEffect(() => {
    if (id) {
      dispatch(fetchPlanById(id))
        .unwrap()
        .catch(() => toast.error("Failed to fetch plan details!"));
    }
  }, [dispatch, id]);

  if(!data) return <div className="p-7 text-htb-text-dim font-mono uppercase tracking-widest">Loading...</div>

  const transformedPlan = {
    _id: data?._id,
    name: data?.name,
    price: data?.price, 
    priceMode: data?.priceMode, 
    popular: data?.popular,
    startDate: data?.startDate,
    endDate: data?.endDate,
    durationDays: data?.durationDays,
    isActive: data?.isActive,
    details: data?.details?.map((detail, index) => ({
      id: index + 1,
      detail,
    })),
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
              <BreadcrumbPage className="text-neon font-mono text-xs uppercase tracking-widest">Edit Plan</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="mt-3 mb-5">
        <span className="terminal-eyebrow">edit.plan</span>
        <h1 className="heading-display text-2xl text-htb-text mt-1">Edit Plan</h1>
      </div>
      <div>
        <EditPlanForm initialData={transformedPlan} />
      </div>
    </section>
  );
};

const Page = () => {
  return (
    <Suspense fallback={<div className="p-7 text-htb-text-dim font-mono uppercase tracking-widest">Loading...</div>}>
      <PageContent />
    </Suspense>
  );
};

export default Page;
