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
import SectionHeader from "@/components/adminDashboard/SectionHeader";
import PlanCard from "@/components/adminDashboard/plan&Billing/PlanCard";
import CouponCard from "@/components/adminDashboard/plan&Billing/CouponCard";
import TransactionsTable from "@/components/adminDashboard/plan&Billing/TransactionsTable";
import { transactions } from "@/constants";
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
    <section className="bg-[#f9f9f9] h-50 p-7">
      <div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Subscription</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <h1 className="heading mt-4">Subscription</h1>

      <div className="flex justify-between items-center  h-[60px]">
        <div className="w-[50%] ">
          <div className="flex flex-row justify-evenly gap-10">
            <button
              className={`font-bold text-center w-[33%] p-1 ${
                activeTab === "plans"
                  ? "border-b-2 border-purple text-purple"
                  : "text-black"
              }`}
              onClick={() => setActiveTab("plans")}
            >
              Plans
            </button>

            <button
              className={`font-bold text-center w-[33%] p-1 ${
                activeTab === "coupons"
                  ? "border-b-2 border-purple text-purple"
                  : "text-black"
              }`}
              onClick={() => setActiveTab("coupons")}
            >
              Coupons
            </button>

            <button
              className={`font-bold text-center w-[33%] p-1 ${
                activeTab === "transactions"
                  ? "border-b-2 border-purple text-purple"
                  : "text-black"
              }`}
              onClick={() => setActiveTab("transactions")}
            >
              Transactions
            </button>
          </div>
        </div>
        {/* Show Add button only for plans and coupons */}
        {activeTab !== "transactions" && (
          <div>
            <SectionHeader
              buttonText={activeTab === "plans" ? "Add Plan" : "Add Coupon"}
              onButtonClick={handleAddCoupon}
              icon={<Plus />}
              className="mb-4"
            />
          </div>
        )}
      </div>

      {activeTab === "plans" && (
        <div className="min-w-xl mx-auto grid grid-cols-1  gap-4">
          <h2 className="text-black font-semibold mb-2">All Plans</h2>
          {plans?.length > 0 ? (
            plans.map((plan) => (
              <PlanCard
                key={plan._id}
                title={plan.name}
                monthlyPrice={Number(plan.monthlyPrice)}
                yearlyPrice={Number(plan.yearlyPrice)}
                details={plan?.details ?? []}
                onEdit={() => handleEdit("plan", plan._id)}
                onDelete={() => handleDelete("plan", plan._id)}
              />
            ))
          ) : (
            <p className="text-gray-500">No plans found.</p>
          )}
        </div>
      )}

      {activeTab === "coupons" && (
        <div className="min-w-xl mx-auto grid grid-cols-1  gap-4">
          <h2 className="text-black font-semibold mb-2">All Coupons</h2>
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
            <p className="text-gray-500">No coupons found.</p>
          )}
        </div>
      )}

      {activeTab === "transactions" && (
        <TransactionsTable transactions={transactions} />
      )}
    </section>
  );
};

export default Page;
