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
        console.log("Coupon added successfully!");
        handleCancel()
      })
      .catch((err: any) => {
        toast.error(err?.message || "Failed to add coupon!");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className=" flex items-center justify-center py-4 bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-full min-w-xl bg-white rounded-xl border px-8 py-6 space-y-6"
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Coupon Code</label>
            <Input
              placeholder="Enter Code"
              value={formData?.code ?? ''}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value.toUpperCase() })
              }
              className="w-full transition-all duration-200 focus:ring-2 focus:ring-coupon-primary/20"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Category</label>
            <Select
              value={formData?.category ?? ''}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger className="w-full transition-all duration-200 focus:ring-2 focus:ring-coupon-primary/20">
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
            <div className="flex-1 space-y-2">
              <label className="text-sm font-bold text-gray-700">Discount</label>
              <Input
                type="number"
                min="0"
                placeholder="Enter Amount"
                value={formData?.discountAmount ?? 0}
                onChange={(e) =>
                  setFormData({ ...formData, discountAmount: e.target.value })
                }
                className="w-full transition-all duration-200 focus:ring-2 focus:ring-coupon-primary/20"
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

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Details</label>
          <Textarea
            placeholder="Details"
            value={formData?.details ?? ''}
            onChange={(e) =>
              setFormData({ ...formData, details: e.target.value })
            }
            className="min-h-[100px] transition-all duration-200 focus:ring-2 focus:ring-coupon-primary/20"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="flex-1 bg-purple  hover:bg-purple/90 text-white px-4 py-2 rounded-lg transition-all duration-200  focus:ring-2 focus:ring-[#742193]/20 active:scale-[0.98]"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin text-white" />
            ) : (
              "Add Coupon"
            )}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 bg-[#FFCA74] text-gray-800 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-[#FFCA74]/90 focus:ring-2 focus:ring-[#FFCA74]/20 active:scale-[0.98]"
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
    <Suspense fallback={<div className="flex items-center justify-center py-4">Loading...</div>}>
      <CouponFormContent />
    </Suspense>
  );
};

export default CouponForm;
