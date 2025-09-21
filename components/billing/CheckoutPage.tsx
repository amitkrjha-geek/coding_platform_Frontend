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
  console.log("coupons",coupons);


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
    console.log("challengeId", challengeId);
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
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] p-2 overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold text-gray-900">Checkout</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-2 space-y-3">
          {/* Plan Summary */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Plan Summary</h3>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">{plan.name}</h4>
                <p className="text-sm text-gray-500">{plan.priceMode} Plan</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold">₹{originalPrice}</p>
              </div>
            </div>
          </Card>

          {/* Coupon Section */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Coupon Code
            </h3>
            
            {!appliedCoupon ? (
              <div className="flex gap-3">
                <Input
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={applyCoupon}
                  disabled={isApplyingCoupon}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {isApplyingCoupon ? 'Applying...' : 'Apply'}
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-800">
                    {appliedCoupon.code} applied
                  </span>
                  <span className="text-sm text-green-600">
                    (₹{appliedCoupon.discountAmount} off)
                  </span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Remove
                </button>
              </div>
            )}
          </Card>

          {/* Price Breakdown */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Price Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Plan Price</span>
                <span className="font-medium">₹{originalPrice}</span>
              </div>
              
              {appliedCoupon && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({appliedCoupon.code})</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}
              
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{finalPrice}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Payment Button */}
          <Button
            onClick={handleCheckout}
            disabled={isProcessing}
            className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Pay ₹{finalPrice}
              </div>
            )}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};
