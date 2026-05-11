'use client'

import React, { useEffect, useState, Suspense } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import toast from "react-hot-toast";
import { fetchCoupons, registerCoupon } from "@/redux/features/couponSlice";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { RootState } from "@/redux/store";

const CouponFormContent = () => {
  const dispatch = useAppDispatch()
  const { coupons, status } = useAppSelector((state: RootState) => state.coupon);

  const [formData, setFormData] = useState({
    code: "",
    category: "",
    discountAmount: "",
    // discountPercent: "",
    // maxCap: "",
    details: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter()

  useEffect(() => {
    if (!coupons.length && status === 'idle') {
      dispatch(fetchCoupons());
    }
  }, [dispatch, coupons, status]);

  const handleCancel = () => {
    setFormData({
      code: "",
      category: "",
      discountAmount: "",
      // discountPercent: "",
      // maxCap: "",
      details: "",
    });

    router.back()
  };

  const validateForm = () => {
    if (!formData.code.trim()) {
      toast.error("Coupon code is required!");
      return false;
    }
    if (formData.code.trim().length < 3) {
      toast.error("Coupon code must be at least 3 characters long!");
      return false;
    }
    if (!formData.category.trim()) {
      toast.error("Category is required!");
      return false;
    }
    // if (!formData.maxCap.trim()) {
    //   toast.error("Max cap is required!");
    //   return false;
    // }
    // if (!/^\d+$/.test(formData.maxCap.trim())) {
    //   toast.error("Max cap must be a valid number!");
    //   return false;
    // }
    if (!formData.details.trim()) {
      toast.error("Details are required!");
      return false;
    }
    if (formData.details.trim().length < 5) {
      toast.error("Details must be at least 5 characters long!");
      return false;
    }
    if (formData.discountAmount && !/^\d+(\.\d{1,2})?$/.test(formData.discountAmount)) {
      toast.error("Discount amount must be a valid number with up to 2 decimal places!");
      return false;
    }
    // if (formData.discountPercent && !/^\d+(\.\d{1,2})?$/.test(formData.discountPercent)) {
    //   toast.error("Discount percent must be a valid number with up to 2 decimal places!");
    //   return false;
    // }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    dispatch(registerCoupon(formData))
      .unwrap()
      .then(() => {
        // console.log("Coupon added successfully!");
        handleCancel()
      })
      .catch((err: any) => {
        toast.error(err?.message || "Failed to add coupon!");
      })
      .finally(() => setLoading(false));
  };

  const labelClass = "text-htb-muted font-mono text-[11px] uppercase tracking-widest font-semibold";

  return (
    <div className="flex items-center justify-center py-4">
      <form
        onSubmit={handleSubmit}
        className="w-full min-w-xl panel px-8 py-6 space-y-5"
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className={labelClass}>Coupon Code</label>
            <Input
              placeholder="Enter Code"
              value={formData?.code ?? ''}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value.toUpperCase() })
              }
              className="w-full font-mono uppercase tracking-wider"
            />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Category</label>
            <Select
              value={formData?.category ?? ''}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger className="w-full font-mono text-xs uppercase tracking-wider">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="clothing">Clothing</SelectItem>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 space-y-1.5">
              <label className={labelClass}>Discount</label>
              <Input
                type="number"
                min="0"
                placeholder="Enter Amount"
                value={formData?.discountAmount ?? 0}
                onChange={(e) =>
                  setFormData({ ...formData, discountAmount: e.target.value })
                }
                className="w-full"
              />
            </div>
            {/* <div className="flex items-center h-full pt-8">
              <span className="text-gray-500 font-medium">OR</span>
            </div> */}
            {/* <div className="flex-1 space-y-2">
              <label className="text-sm font-bold text-gray-700">
                Discount Percent
              </label>
              <Input
                type="number"
                min="0"
                max="100"
                placeholder="0%-100%"
                value={formData?.discountPercent ?? 0}
                onChange={(e) =>
                  setFormData({ ...formData, discountPercent: e.target.value })
                }
                className="w-full transition-all duration-200 focus:ring-2 focus:ring-coupon-primary/20"
              />
            </div> */}
            {/* <div className="flex-1 space-y-2">
              <label className="text-sm font-bold text-gray-700">
                Max Cap
              </label>
              <Input
                type="number"
                min="0"
                placeholder="Max Discount Amount"
                value={formData?.maxCap ?? 0}
                onChange={(e) =>
                  setFormData({ ...formData, maxCap: e.target.value })
                }
                className="w-full transition-all duration-200 focus:ring-2 focus:ring-coupon-primary/20"
              />
            </div> */}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className={labelClass}>Details</label>
          <Textarea
            placeholder="Details"
            value={formData?.details ?? ''}
            onChange={(e) =>
              setFormData({ ...formData, details: e.target.value })
            }
            className="min-h-[100px]"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 bg-neon hover:bg-neon-green-dim hover:shadow-neon-sm hover:-translate-y-0.5 text-htb-bg px-4 py-2.5 rounded-md transition-all disabled:opacity-50 font-mono text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Adding...</span>
              </>
            ) : (
              "Add Coupon"
            )}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 border border-htb-border bg-htb-panel text-htb-muted hover:text-neon hover:border-neon/40 px-4 py-2.5 rounded-md transition-colors font-mono text-xs uppercase tracking-widest font-semibold"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const CouponForm = () => {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-4 text-htb-text-dim font-mono uppercase tracking-widest">Loading...</div>}>
      <CouponFormContent />
    </Suspense>
  );
};

export default CouponForm;
