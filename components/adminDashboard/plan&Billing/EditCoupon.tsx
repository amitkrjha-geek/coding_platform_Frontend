'use client'

import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAppDispatch } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { modifyCoupon } from "@/redux/features/couponSlice";

interface CouponFormData {
  _id: string;
  code: string;
  category: string;
  discountAmount: string;
  // discountPercent: string;
  // maxCap: string;
  details: string;
}

interface UpdateCouponFormProps {
  initialData: CouponFormData;
}

const UpdateCouponForm = ({ initialData }: UpdateCouponFormProps) => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CouponFormData>(initialData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.code.trim()) {
      toast.error("Coupon code is required!");
      return;
    }

    if (!formData.category.trim()) {
      toast.error("Category is required!");
      return;
    }

    //   if (!formData.maxCap.trim() || isNaN(Number(formData.maxCap))) {
    //   toast.error("Valid max cap is required!");
    //   return;
    // }

    if (!formData.details.trim()) {
      toast.error("Details are required!");
      return;
    }

    if (formData.details.length < 5) {
      toast.error("Details must be at least 5 characters long!");
      return;
    }

    if (
      formData.discountAmount &&
      (isNaN(Number(formData.discountAmount)) || Number(formData.discountAmount) < 0)
    ) {
      toast.error("Discount amount must be a valid positive number!");
      return;
    }

    // if (
    //   formData.discountPercent &&
    //   (isNaN(Number(formData.discountPercent)) ||
    //     Number(formData.discountPercent) < 0 ||
    //     Number(formData.discountPercent) > 100)
    // ) {
    //   toast.error("Discount percent must be a valid number between 0 and 100!");
    //   return;
    // }

    setLoading(true);

    const { _id, ...dataWithoutId } = formData;

    const transformedData: Omit<CouponFormData, "_id"> = {
      ...dataWithoutId,
      discountAmount: formData.discountAmount.trim(),
      // discountPercent: formData.discountPercent.trim(),
      // maxCap: formData.maxCap.trim(),
      details: formData.details.trim(),
    };

    dispatch(modifyCoupon({ id: _id!, data: transformedData }))
      .unwrap()
      .then((res) => {
        // console.log("Coupon updated successfully:", res);
        router.back();
      })
      .catch((error) => {
        console.error("Coupon update failed:", error);
        toast.error(error?.message || "Coupon update failed!");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleReset = () => {
    setFormData(initialData);
  };

  const labelClass = "text-htb-muted font-mono text-[11px] uppercase tracking-widest font-semibold";

  return (
    <div className="flex items-center justify-center py-4">
      <form
        onSubmit={handleSubmit}
        className="w-full min-w-xl panel px-8 py-6 space-y-5"
      >
        {/* Coupon Code */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className={labelClass}>Coupon Code</label>
            <Input
              placeholder="Enter Code"
              value={formData?.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="w-full font-mono uppercase tracking-wider"
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className={labelClass}>Category</label>
            <Select
              value={formData?.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
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

        {/* Discount Fields */}
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 space-y-1.5">
              <label className={labelClass}>Discount Amount</label>
              <Input
                type="number"
                min="0"
                placeholder="Enter Amount"
                value={formData?.discountAmount}
                onChange={(e) => setFormData({ ...formData, discountAmount: e.target.value })}
                className="w-full"
              />
            </div>

            {/* <div className="flex items-center h-full pt-8">
              <span className="text-gray-500 font-medium">OR</span>
            </div> */}

            {/* <div className="flex-1 space-y-2">
              <label className="text-sm font-bold text-gray-700">Discount Percent</label>
              <Input
                type="number"
                min="0"
                max="100"
                placeholder="0%-100%"
                value={formData?.discountPercent}
                onChange={(e) => setFormData({ ...formData, discountPercent: e.target.value })}
                className="w-full transition-all duration-200 focus:ring-2 focus:ring-coupon-primary/20"
              />
            </div> */}

            {/* <div className="flex-1 space-y-2">
              <label className="text-sm font-bold text-gray-700">Max Cap</label>
              <Input
                type="number"
                min="0"
                placeholder="Max Discount Amount"
                value={formData?.maxCap}
                onChange={(e) => setFormData({ ...formData, maxCap: e.target.value })}
                className="w-full transition-all duration-200 focus:ring-2 focus:ring-coupon-primary/20"
              />
            </div> */}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-1.5">
          <label className={labelClass}>Details</label>
          <Textarea
            placeholder="Details"
            value={formData?.details}
            onChange={(e) => setFormData({ ...formData, details: e.target.value })}
            className="min-h-[100px]"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 bg-neon hover:bg-neon-green-dim hover:shadow-neon-sm hover:-translate-y-0.5 text-htb-bg px-4 py-2.5 rounded-md transition-all disabled:opacity-50 font-mono text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Updating...</span>
              </>
            ) : (
              "Update Coupon"
            )}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 border border-htb-border bg-htb-panel text-htb-muted hover:text-neon hover:border-neon/40 px-4 py-2.5 rounded-md transition-colors font-mono text-xs uppercase tracking-widest font-semibold"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateCouponForm;
