"use client";

import React, { useState, Suspense, useEffect } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import PlanCard from "@/components/adminDashboard/plan&Billing/PlanCard";
import CouponCard from "@/components/adminDashboard/plan&Billing/CouponCard";
import TransactionsTable from "@/components/adminDashboard/plan&Billing/TransactionsTable";
// import { transactions } from "@/constants";
import { fetchCoupons, removeCoupon } from "@/redux/features/couponSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import toast from "react-hot-toast";
import { fetchPlans, removePlan } from "@/redux/features/planSlice";

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PlanBillingPage />
    </Suspense>
  );
};

const PlanBillingPage = () => {
  const dispatch = useAppDispatch();

  const { plans, status: planStatus } = useAppSelector((state: RootState) => state.plan);
  const { coupons, status: couponsStatus } = useAppSelector((state: RootState) => state.coupon);

  // console.log('plans', plans);

  
  const [activeTab, setActiveTab] = useState<
    "plans" | "coupons" | "transactions"
  >("plans");

  const router = useRouter();


  useEffect(() => {
    if (activeTab === "plans" && !plans.length && planStatus === 'idle') {
      dispatch(fetchPlans());
    }
  }, [activeTab, dispatch, plans, planStatus]);


  useEffect(() => {
    if (activeTab === "coupons" && !coupons.length && couponsStatus === 'idle') {
      dispatch(fetchCoupons());
    }
  }, [activeTab, dispatch, coupons, couponsStatus]);


  const handleAddCoupon = () => {
    router.push(
      `${
        activeTab === "plans"
          ? "/admin/plan-billing/addPlan"
          : "/admin/plan-billing/addCoupon"
      }`
    );
  };

  const handleEdit = (action: 'plan' | 'coupon', id: string) => {
    if (action === "plan") {
      router.push(`/admin/plan-billing/editPlan?id=${id}`);
    } else {
      router.push(`/admin/plan-billing/editCoupon?id=${id}`);
    }
  };
  const handleDelete = (action: 'plan' | 'coupon', id: string) => {
    if (!id) {
      toast.error("Invalid ID provided!");
      return;
    }

    const thunk = action === "plan" ? removePlan : removeCoupon;

    dispatch(thunk(id))
      .unwrap()
      .then(() => {
        console.log(`${action === "plan" ? "Plan" : "Coupon"} deleted successfully!`);
      })
      .catch((error) => {
        console.error(`Failed to delete ${action}:`, error);
        toast.error(`Failed to delete ${action === "plan" ? "Plan" : "Coupon"}!`);
      });
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
              <BreadcrumbPage className="text-neon font-mono text-xs uppercase tracking-widest">Subscription</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="mt-3 mb-4">
        <span className="terminal-eyebrow">subscription</span>
        <h1 className="heading-display text-2xl text-htb-text mt-1">Subscription</h1>
      </div>

      <div className="flex flex-wrap justify-between items-center gap-4 border-b border-htb-border mb-6">
        <div className="flex items-center gap-1">
          {(["plans", "coupons", "transactions"] as const).map((tab) => (
            <button
              key={tab}
              className={`relative px-5 py-3 -mb-px font-mono text-xs uppercase tracking-widest font-semibold transition-colors ${
                activeTab === tab
                  ? "text-neon border-b-2 border-neon"
                  : "text-htb-muted border-b-2 border-transparent hover:text-htb-text"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        {/* Show Add button only for plans and coupons */}
        {activeTab !== "transactions" && (
          <div className="pb-2">
            <button
              onClick={handleAddCoupon}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-neon text-white hover:shadow-neon-sm hover:-translate-y-0.5 transition-all font-mono text-xs uppercase tracking-widest font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              {activeTab === "plans" ? "Add Plan" : "Add Coupon"}
            </button>
          </div>
        )}
      </div>

      {activeTab === "plans" && (
        <div className="w-full">
          <span className="terminal-eyebrow mb-3 inline-block">all.plans</span>
          {plans?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {plans.map((plan) => (
                <PlanCard
                  key={plan._id}
                  title={plan.name}
                  price={plan.price}
                  priceMode={plan.priceMode}
                  popular={plan.popular}
                  details={plan?.details ?? []}
                  durationDays={plan.durationDays}
                  isActive={plan.isActive}
                  startDate={plan.startDate}
                  endDate={plan.endDate}
                  onEdit={() => handleEdit("plan", plan._id)}
                  onDelete={() => handleDelete("plan", plan._id)}
                />
              ))}
            </div>
          ) : (
            <p className="text-htb-text-dim font-mono uppercase tracking-widest text-sm">No plans found.</p>
          )}
        </div>
      )}

      {activeTab === "coupons" && (
        <div className="grid grid-cols-1 gap-3">
          <span className="terminal-eyebrow mb-1 inline-block">all.coupons</span>
          {coupons?.length > 0 ? (
            coupons.map((coupon) => (
              <CouponCard
                key={coupon?._id}
                title={coupon?.code}
                discount={Number(coupon?.discountAmount ?? "0")}
                details={coupon?.details ?? ""}
                onEdit={() => handleEdit("coupon", coupon?._id)}
                onDelete={() => handleDelete("coupon", coupon?._id)}
              />
            ))
          ) : (
            <p className="text-htb-text-dim font-mono uppercase tracking-widest text-sm">No coupons found.</p>
          )}
        </div>
      )}

      {activeTab === "transactions" && (
        <TransactionsTable />
      )}
    </section>
  );
};

export default Page;
