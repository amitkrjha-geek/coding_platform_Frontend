'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Check, CreditCard, Tag, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { getPayment } from '@/API/payment';
import { getAllCoupons } from '@/API/coupon';
import { toast } from 'react-hot-toast';
import { useUser } from '@clerk/nextjs';
import { getCurrentUserId } from '@/config/token';

interface Coupon {
  _id: string;
  code: string;
  category: string;
  discountAmount: string;
  details: string;
  __v: number;
}

interface Plan {
  _id: string;
  name: string;
  price: number;
  priceMode: string;
  popular: boolean;
  details: string[];
}

interface CheckoutPageProps {
  plan: Plan;
  onClose: () => void;
  onSuccess: (form: string) => void;
  challengeId?: string;
}

export const CheckoutPage = ({ plan, onClose, onSuccess, challengeId }: CheckoutPageProps) => {
  const { user } = useUser();
  const name = user?.fullName || '';
  const email = user?.primaryEmailAddress?.emailAddress || '';
  const currentUserId = getCurrentUserId();

  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate pricing
  const originalPrice = plan.price;
  const discountAmount = appliedCoupon ? Number(appliedCoupon.discountAmount) : 0;
  const finalPrice = Math.max(originalPrice - discountAmount, 0);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await getAllCoupons();
      setCoupons(response || []);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    }
  };
  // console.log("coupons",coupons);


  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    setIsApplyingCoupon(true);
    try {
      const coupon = coupons.find(c => 
        c.code.toLowerCase() === couponCode.toLowerCase()
      );

      if (!coupon) {
        toast.error('Invalid coupon code');
        return;
      }

      // Check if discount amount is valid
      const discountValue = Number(coupon.discountAmount);
      if (isNaN(discountValue) || discountValue <= 0) {
        toast.error('Invalid discount amount');
        return;
      }

      // Check if discount is not more than the original price
      if (discountValue > originalPrice) {
        toast.error('Discount amount cannot be more than the plan price');
        return;
      }

      setAppliedCoupon(coupon);
      setCouponCode('');
      toast.success('Coupon applied successfully!');
    } catch (error) {
      toast.error('Failed to apply coupon');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    toast.success('Coupon removed');
  };

  const handleCheckout = async () => {
    setIsProcessing(true);
    // console.log("challengeId", challengeId);
    try {
      const response = await getPayment({
        amount: finalPrice,
        product: 'Coding Platform',
        firstname: name,
        email: email,
        mobile: `85${Math.floor(Math.random() * 56000)}485`,
        userId: currentUserId || undefined,
        planId: plan._id,
        couponId: appliedCoupon?._id,
        realAmount: originalPrice,
        ...(challengeId && { challengeId: challengeId })
      });

      
      onSuccess(response);
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Failed to initialize payment');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-htb-bg-deep/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative panel max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-panel-lg"
      >
        {/* Top neon accent */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon/60 to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-htb-border">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              aria-label="Back"
              className="flex items-center justify-center w-9 h-9 rounded-md border border-htb-border text-htb-muted hover:text-neon hover:border-neon/40 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <span className="terminal-eyebrow">checkout</span>
              <h2 className="text-xl font-bold text-htb-text">Confirm Order</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex items-center justify-center w-9 h-9 rounded-md border border-htb-border text-htb-muted hover:text-neon hover:border-neon/40 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 sm:p-5 space-y-4">
          {/* Plan Summary */}
          <Card className="p-5">
            <span className="terminal-eyebrow">plan.summary</span>
            <div className="flex items-center justify-between mt-3">
              <div>
                <h4 className="font-semibold text-htb-text text-base">
                  {plan.name}
                </h4>
                <p className="text-xs font-mono uppercase tracking-wider text-htb-text-dim mt-0.5">
                  {plan.priceMode} Plan
                </p>
              </div>
              <div className="text-right">
                <p className="font-mono text-2xl font-bold text-htb-text tabular-nums">
                  ₹{originalPrice}
                </p>
              </div>
            </div>
          </Card>

          {/* Coupon Section */}
          <Card className="p-5">
            <span className="terminal-eyebrow flex items-center gap-2">
              <Tag className="w-3.5 h-3.5" />
              coupon.code
            </span>

            {!appliedCoupon ? (
              <div className="flex gap-3 mt-3">
                <Input
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 font-mono uppercase tracking-wider"
                />
                <Button
                  variant="ghost-neon"
                  onClick={applyCoupon}
                  disabled={isApplyingCoupon}
                  className="font-mono text-xs uppercase tracking-widest"
                >
                  {isApplyingCoupon ? 'Applying...' : 'Apply'}
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 mt-3 bg-neon/10 border border-neon/30 rounded-md">
                <div className="flex items-center gap-2 min-w-0">
                  <Check className="w-4 h-4 text-neon shrink-0" />
                  <span className="font-mono text-xs uppercase tracking-widest font-semibold text-neon truncate">
                    {appliedCoupon.code}
                  </span>
                  <span className="text-xs text-neon-green-dim">
                    (₹{appliedCoupon.discountAmount} off)
                  </span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="shrink-0 ml-2 text-danger hover:text-danger/80 text-[11px] font-mono uppercase tracking-widest font-semibold"
                >
                  Remove
                </button>
              </div>
            )}
          </Card>

          {/* Price Breakdown */}
          <Card className="p-5">
            <span className="terminal-eyebrow">price.breakdown</span>
            <div className="space-y-3 mt-3">
              <div className="flex justify-between text-sm">
                <span className="text-htb-muted">Plan Price</span>
                <span className="font-mono text-htb-text tabular-nums">₹{originalPrice}</span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-sm text-neon">
                  <span>Discount ({appliedCoupon.code})</span>
                  <span className="font-mono tabular-nums">-₹{discountAmount}</span>
                </div>
              )}

              <div className="border-t border-htb-border pt-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-htb-text font-semibold">Total</span>
                  <span className="font-mono text-2xl font-bold text-neon tabular-nums">
                    ₹{finalPrice}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Payment Button */}
          <Button
            variant="neon"
            onClick={handleCheckout}
            disabled={isProcessing}
            className="w-full py-3 font-mono text-xs uppercase tracking-widest"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-htb-bg border-t-transparent rounded-full animate-spin" />
                Processing...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Pay ₹{finalPrice}
              </div>
            )}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};
