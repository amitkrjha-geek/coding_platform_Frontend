"use client";

// import { plans } from '@/constants';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import CheckoutModal from './CheckoutModal';
import { CheckoutPage } from './CheckoutPage';
// import { getPayment } from '@/API/payment';
// import type { PaymentData } from '@/API/payment';
// import { toast } from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import { fetchPlans } from '@/redux/features/planSlice';
// import { useUser } from '@clerk/nextjs';
import {  getToken } from '@/config/token';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export const PricingPlans = () => {
  const dispatch = useAppDispatch();
  const token = getToken();
  const router = useRouter();

  // const { user } = useUser();
  // const name = user?.fullName || '';
  // const email = user?.primaryEmailAddress?.emailAddress || '';
  // const currentUserId = getCurrentUserId();


  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const { plans, status: planStatus } = useAppSelector((state: RootState) => state.plan);

  useEffect(() => {
    if ( !plans.length && planStatus === 'idle') {
      dispatch(fetchPlans());
    }
  }, [dispatch, plans, planStatus]);

  // const handleSubscribe = (plan: typeof plans[0]) => {
  //   setSelectedPlan(plan);
  //   setIsModalOpen(true);
  // };

  const[form,setForm] = useState('')

  useEffect(()=>{
  
    const formData = document.getElementById("payment_post") as HTMLFormElement;
      if(formData){
        formData.submit()
      }
  
  },[form])


  // const handleSubscribe = async ({ amount, product, firstname, email, mobile, userId, planId }: PaymentData) => {
  //   try {
  //     const response = await getPayment({ amount, product, firstname, email, mobile, userId, planId });
  //     setForm(response);
  //   } catch (error: any) {
  //     console.error("Payment error:", error);
  //     toast.error(error.message || "Failed to initialize payment");
  //   }
  // };

  const handleCheckoutSuccess = (form: string) => {
    setForm(form);
    setIsCheckoutOpen(false);
  };

  const handlePlanSelect = (plan: typeof plans[0]) => {
    if(!token){
      toast.error("Please login to subscribe to a plan");
      setTimeout(() => {
        router.push("/sign-in");
      }, 1000);
      return;
    }
    setSelectedPlan(plan);
    setIsCheckoutOpen(true);
  };




  return (
    <>
    <div
        dangerouslySetInnerHTML={{ __html: form }}
        style={{ marginTop: "20px", border: "1px solid #ddd", padding: "10px" }}
        />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
        {plans.filter((plan) => plan.priceMode !== "Per Challenge").map((plan) => (
          <motion.div
            key={plan.name}
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ duration: 0.2 }}
            className={`relative rounded-2xl p-8 transition-all duration-300 ${
              plan.popular
                ? 'bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 shadow-lg shadow-purple-200/50'
                : 'bg-white border border-gray-200 shadow-md hover:shadow-lg'
            }`}
          >
            {/* Popular Badge */}
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-1 text-sm font-medium rounded-full shadow-lg">
                  Most Popular
                </span>
              </div>
            )}

            {/* Plan Header */}
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <div className="flex items-baseline justify-center">
                <span className="text-4xl font-bold text-gray-900">₹{plan.price}</span>
                <span className="text-gray-500 ml-2 text-lg">/{plan.priceMode}</span>
              </div>
            </div>

            {/* Features List */}
            <div className="mb-8">
              <ul className="space-y-4">
                {plan.details.map((detail, index) => (
                  <li
                    key={index}
                    className="flex items-start text-gray-700"
                  >
                    <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm leading-relaxed">{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Subscribe Button */}
            <button
              onClick={() => handlePlanSelect(plan)}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                plan.popular
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-600/25 hover:shadow-xl hover:shadow-purple-600/30'
                  : 'bg-gray-900 text-white hover:bg-gray-800 shadow-lg hover:shadow-xl'
              }`}
            >
              Subscribe Now
            </button>
          </motion.div>
        ))}
      </div>

      <CheckoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        plan={selectedPlan || plans[0]}
      />

      {isCheckoutOpen && selectedPlan && (
        <CheckoutPage
          plan={selectedPlan}
          onClose={() => setIsCheckoutOpen(false)}
          onSuccess={handleCheckoutSuccess}
        />
      )}
    </>
  );
}; 