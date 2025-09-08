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

  if(!data) return <div>Loading...</div>

  const transformedPlan = {
    _id: data?._id,
    name: data?.name,
    price: data?.price, 
    priceMode: data?.priceMode, 
    popular: data?.popular,
    details: data?.details?.map((detail, index) => ({
      id: index + 1,
      detail,
    })),
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
              <BreadcrumbPage>Edit Plan</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <h1 className="heading1 mt-2">Edit Plan</h1>
      <div>
        <EditPlanForm initialData={transformedPlan} />
      </div>
    </section>
  );
};

const Page = () => {
  return (
    <Suspense fallback={<div className="p-7">Loading...</div>}>
      <PageContent />
    </Suspense>
  );
};

export default Page;
