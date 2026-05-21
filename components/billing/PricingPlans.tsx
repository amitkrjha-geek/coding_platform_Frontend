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
import { useAuth } from '@clerk/nextjs';

export const PricingPlans = () => {
  const dispatch = useAppDispatch();
  // const token = getToken();
  const router = useRouter();
      const { userId } = useAuth();      
  

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
    if(!userId){
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
      {/* Hidden payment form auto-submit — preserved */}
      <div
        dangerouslySetInnerHTML={{ __html: form }}
        style={{ display: "none" }}
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
        {plans
          .filter((plan) => plan.priceMode !== "Per Challenge")
          .map((plan) => (
            <motion.div
              key={plan.name}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className={`group relative rounded-lg p-6 sm:p-7 transition-all duration-300 ${
                plan.popular ? "popular_pricing" : "panel panel-hover"
              }`}
            >
              {/* Top neon accent for popular */}
              {plan.popular && (
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon to-transparent" />
              )}

              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 bg-neon text-white px-3 py-1 text-[10px] font-mono font-semibold uppercase tracking-widest rounded shadow-neon-sm">
                    <span className="block w-1.5 h-1.5 rounded-full bg-white" />
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="mb-6">
                <span
                  className={`terminal-eyebrow ${plan.popular ? "" : ""}`}
                >
                  tier.{plan.name.trim().toLowerCase().replace(/\s+/g, "_")}
                </span>
                <h3 className="text-2xl font-bold text-htb-text mt-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-2 mt-3">
                  <span className="font-mono text-4xl sm:text-5xl font-bold text-htb-text tabular-nums">
                    ₹{plan.price}
                  </span>
                  <span className="text-htb-text-dim text-sm font-mono uppercase tracking-wider">
                    /{plan.priceMode}
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-htb-border mb-6" />

              {/* Features List */}
              <div className="mb-7">
                <ul className="space-y-3">
                  {plan.details.map((detail, index) => (
                    <li key={index} className="flex items-start gap-3 text-htb-muted">
                      <div className="flex-shrink-0 w-5 h-5 rounded border border-neon/30 bg-neon/10 flex items-center justify-center mt-0.5">
                        <svg
                          className="w-3 h-3 text-neon"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
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
                className={`group/btn relative w-full overflow-hidden py-3.5 px-6 rounded-md font-mono text-xs uppercase tracking-widest font-semibold transition-all duration-300 ${
                  plan.popular
                    ? "bg-neon text-white hover:shadow-neon-sm hover:-translate-y-0.5"
                    : "bg-htb-panel-2 text-htb-text border border-htb-border hover:border-neon/40 hover:text-neon hover:-translate-y-0.5"
                }`}
              >
                <span className="relative z-10">Subscribe Now</span>
                {plan.popular && (
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-htb-bg/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                )}
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