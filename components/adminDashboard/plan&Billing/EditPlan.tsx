'use client'

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, Plus, X } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAppDispatch } from "@/redux/hooks";
import { modifyPlan } from "@/redux/features/planSlice";
import { useRouter } from "next/navigation";

interface PlanDetail {
  id: number;
  detail: string;
}

interface PlanFormData {
  _id?: string;
  name: string;
  monthlyPrice: string;
  yearlyPrice: string;
  details: PlanDetail[];
}

interface EditPlanFormProps {
  initialData: PlanFormData;
}

const EditPlanForm = ({ initialData }: EditPlanFormProps) => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [planDetails, setPlanDetails] = useState<PlanDetail[]>(initialData.details);
  const [currentDetail, setCurrentDetail] = useState('');
  const [formData, setFormData] = useState<PlanFormData>(initialData);
  const [loading, setLoading] = useState(false);

  const handleAddPoint = () => {
    if (currentDetail.trim()) {
      const newDetail = {
        id: Date.now(),
        detail: currentDetail,
      };
      setPlanDetails([...planDetails, newDetail]);
      setCurrentDetail('');
      setFormData((prev) => ({
        ...prev,
        details: [...prev.details, newDetail],
      }));
    }
  };

  const handleRemovePoint = (id: number) => {
    const updatedDetails = planDetails.filter((detail) => detail.id !== id);
    setPlanDetails(updatedDetails);
    setFormData((prev) => ({
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

    if (!formData.monthlyPrice.trim() || isNaN(Number(formData.monthlyPrice))) {
      toast.error("Valid monthly price is required!");
      return;
    }

    if (!formData.yearlyPrice.trim() || isNaN(Number(formData.yearlyPrice))) {
      toast.error("Valid yearly price is required!");
      return;
    }

    if (formData.details.length < 3) {
      toast.error("At least 3 features are required!");
      return;
    }

    setLoading(true);

    const { _id, ...dataWithoutId } = formData;

    const transformedData = {
      ...dataWithoutId,
      details: formData.details.map((item) => item.detail),
    };

    dispatch(modifyPlan({ id: _id!, data: transformedData }))
      .unwrap()
      .then((res) => {
        console.log("Plan updated successfully:", res);
        router.back();
      })
      .catch((error) => {
        console.error("Plan updation failed:", error);
        toast.error(error?.message || "Plan updation failed!");
      })
      .finally(() => {
        setLoading(false);
      });
  };


  const handleReset = () => {
    setFormData(initialData);
    setPlanDetails(initialData.details);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="flex items-center justify-center bg-gray-50 py-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full min-w-xl"
      >
        <Card className="p-6 space-y-6 rounded-xl border bg-white">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Plan Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Plan Name</label>
              <Input
                name="name"
                placeholder="Enter Plan Name"
                value={formData?.name}
                onChange={handleInputChange}
                className="w-full transition-all duration-200 focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Monthly & Yearly Prices */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Monthly Price</label>
                <Input
                  name="monthlyPrice"
                  placeholder="Enter Amount"
                  min="0"
                  type="number"
                  value={formData?.monthlyPrice}
                  onChange={handleInputChange}
                  className="w-full transition-all duration-200 focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Yearly Price</label>
                <Input
                  name="yearlyPrice"
                  min="0"
                  placeholder="Enter Amount"
                  type="number"
                  value={formData?.yearlyPrice}
                  onChange={handleInputChange}
                  className="w-full transition-all duration-200 focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Plan Details */}
            <div className="space-y-4">
              <label className="text-sm font-medium text-gray-700">Plan Detail Points</label>
              <div className="space-y-2">
                {planDetails.map((detail, index) => (
                  <motion.div
                    key={detail.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between bg-gray-50 p-2 rounded-md group"
                  >
                    <span className="text-sm text-gray-600">{detail.detail}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemovePoint(detail.id)}
                      className="transition-opacity duration-200"
                    >
                      <X className="h-4 w-4 text-gray-500 hover:text-red-500" />
                    </Button>
                  </motion.div>
                ))}
              </div>
              <div className="flex space-x-2">
                <Input
                  value={currentDetail}
                  onChange={(e) => setCurrentDetail(e.target.value)}
                  placeholder="Enter detail point"
                  className="flex-1 transition-all duration-200 focus:ring-2 focus:ring-purple-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddPoint();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={handleAddPoint}
                  className="bg-purple  hover:bg-purple/90 text-white transition-colors duration-200"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Point
                </Button>
              </div>
            </div>

            {/* Submit and Reset Buttons */}
            <div className="flex space-x-4 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-purple  hover:bg-purple/90 text-white transition-colors duration-200 flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin text-white" />
                    <span>Updating...</span>
                  </>
                ) : (
                  "Update Plan"
                )}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handleReset}
                className="flex-1 bg-[#FFCA74] hover:bg-[#ddaa59] text-[#742193] transition-colors duration-200"
              >
                Reset
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default EditPlanForm;
