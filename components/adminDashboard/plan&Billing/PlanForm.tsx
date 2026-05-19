'use client'

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, X } from "lucide-react";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchPlans, registerPlan } from '@/redux/features/planSlice';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { RootState } from '@/redux/store';

interface PlanDetail {
  id: number;
  detail: string;
}

interface PlanFormData {
  name: string;
  popular: boolean;
  priceMode: string;
  price: number;
  details: PlanDetail[];
  startDate?: string;
  endDate?: string;
}

const PlanForm = () => {
  const dispatch = useAppDispatch()
  const { plans, status } = useAppSelector((state: RootState) => state.plan);
  const [planDetails, setPlanDetails] = useState<PlanDetail[]>([]);
  const [currentDetail, setCurrentDetail] = useState('');
  const [formData, setFormData] = useState<PlanFormData>({
    name: '',
    popular: false,
    priceMode: 'Per Challenge',
    price: 0,
    details: [],
    startDate: '',
    endDate: '',
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const clearForm = () => {
    setFormData({
      name: '',
      popular: false,
      priceMode: 'Per Challenge',
      price: 0,
      details: [],
      startDate: '',
      endDate: '',
    });

    router.back();
  }

  useEffect(() => {
    if (!plans.length && status === 'idle') {
      dispatch(fetchPlans());
    }
  }, [dispatch, plans, status]);

  const handleAddPoint = () => {
    if (currentDetail.trim()) {
      const newDetail = {
        id: Date.now(),
        detail: currentDetail,
      };
      setPlanDetails([...planDetails, newDetail]);
      setCurrentDetail('');
      setFormData(prev => ({
        ...prev,
        details: [...prev.details, newDetail],
      }));
    }
  };

  const handleRemovePoint = (id: number) => {
    const updatedDetails = planDetails.filter(detail => detail.id !== id);
    setPlanDetails(updatedDetails);
    setFormData(prev => ({
      ...prev,
      details: updatedDetails,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error("Plan name is required!");
      return;
    }

    if (!formData.price || formData.price <= 0) {
      toast.error("Valid price is required!");
      return;
    }


    if (formData.details.length < 3) {
      toast.error("At least 3 features are required!");
      return;
    }

    // Validate dates for subscription plans
    if (formData.priceMode !== 'Per Challenge') {
      if (!formData.startDate) {
        toast.error("Start date is required for subscription plans!");
        return;
      }
      if (!formData.endDate) {
        toast.error("End date is required for subscription plans!");
        return;
      }
      if (new Date(formData.startDate) >= new Date(formData.endDate)) {
        toast.error("End date must be after start date!");
        return;
      }
    }

    setLoading(true);

    const isSubscription = formData.priceMode !== 'Per Challenge';
    const transformedData: Record<string, unknown> = {
      name: formData.name,
      popular: formData.popular,
      priceMode: formData.priceMode,
      price: formData.price,
      details: formData.details.map((item) => item.detail),
    };
    if (isSubscription) {
      transformedData.startDate = formData.startDate;
      transformedData.endDate = formData.endDate;
    }

    dispatch(registerPlan(transformedData))
      .unwrap()
      .then((res) => {
        // console.log("Plan registered successfully:", res);
        clearForm()
      })
      .catch((error) => {
        console.error("Plan registration failed:", error);
        toast.error(error?.message || "Plan registration failed!");
      })
      .finally(() => {
        setLoading(false);
      });
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'name' ? value.toUpperCase() : (name === 'price' ? Number(value) : value),
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      priceMode: value,
    }));
  };

  const labelClass = "text-htb-muted font-mono text-[11px] uppercase tracking-widest font-semibold";

  return (
    <div className="flex items-center justify-center py-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="w-full min-w-xl"
      >
        <Card className="p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className={labelClass}>Plan Name</label>
              <Input
                name="name"
                placeholder="Enter Plan Name"
                value={formData?.name}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className={labelClass}>Price</label>
                <Input
                  name="price"
                  placeholder="Enter Amount"
                  min="0"
                  type="number"
                  value={formData?.price}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Price Mode</label>
                <Select value={formData.priceMode} onValueChange={handleSelectChange}>
                  <SelectTrigger className="w-full font-mono text-xs uppercase tracking-wider">
                    <SelectValue placeholder="Select price mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Per Challenge">Per Challenge</SelectItem>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Date Fields for Subscription Plans */}
            {formData.priceMode !== 'Per Challenge' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-md border border-sky-400/30 bg-sky-400/5">
                <div className="space-y-1.5">
                  <label className={labelClass}>Start Date <span className="text-danger">*</span></label>
                  <Input
                    name="startDate"
                    type="date"
                    value={formData?.startDate}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className={labelClass}>End Date <span className="text-danger">*</span></label>
                  <Input
                    name="endDate"
                    type="date"
                    value={formData?.endDate}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <p className="text-xs text-sky-300 font-mono uppercase tracking-wider">
                    These dates define the subscription validity period for {formData.priceMode.toLowerCase()} plans
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <label className={labelClass}>Plan Detail Points</label>
              <div className="space-y-2">
                {planDetails.map((detail, index) => (
                  <motion.div
                    key={detail.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: index * 0.05 }}
                    className="flex items-center justify-between bg-htb-bg/40 border border-htb-border p-2.5 rounded-md group"
                  >
                    <span className="text-sm text-htb-text">{detail.detail}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemovePoint(detail.id)}
                      className="transition-opacity duration-200"
                    >
                      <X className="h-4 w-4 text-htb-text-dim hover:text-danger" />
                    </Button>
                  </motion.div>
                ))}
              </div>
              <div className="flex space-x-2">
                <Input
                  value={currentDetail}
                  onChange={(e) => setCurrentDetail(e.target.value)}
                  placeholder="Enter detail point"
                  className="flex-1"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddPoint();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="ghost-neon"
                  onClick={handleAddPoint}
                  className="font-mono text-[11px] uppercase tracking-widest"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add
                </Button>
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <Button
                type="submit"
                variant="neon"
                className="flex-1 font-mono text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  "Add Plan"
                )}
              </Button>
              <Button
                type="button"
                variant="outline-dim"
                className="flex-1 font-mono text-xs uppercase tracking-widest"
                onClick={() => clearForm()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default PlanForm;
