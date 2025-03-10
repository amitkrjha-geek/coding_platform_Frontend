"use client";

import { plans } from '@/constants';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import CheckoutModal from './CheckoutModal';
import { getPayment } from '@/API/payment';
import type { PaymentData } from '@/API/payment';
import { toast } from 'react-hot-toast';

export const PricingPlans = () => {
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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


  const handleSubscribe = async ({ amount, product, firstname, email, mobile }: PaymentData) => {
    try {
      const response = await getPayment({ amount, product, firstname, email, mobile });
      setForm(response);
    } catch (error: any) {
      console.error("Payment error:", error);
      toast.error(error.message || "Failed to initialize payment");
    }
  };

  // const handleSubscribe = async({amount,product,firstname,email,mobile}:any)=>{
  //   try {
      
  //       const data = await (await axios.post("http://localhost:8080/get-payment",{
  //         amount,product,firstname,email,mobile
  //       })).data
  //         console.log("payment data",data);
          
  //       setForm(data);
        
  //   } catch (error:any) {
  //     console.log("payment error",error.response.data.msg);
      
  //   }
  // }


  return (
    <>
    <div
        dangerouslySetInnerHTML={{ __html: form }}
        style={{ marginTop: "20px", border: "1px solid #ddd", padding: "10px" }}
        />
      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <motion.div
            key={plan.name}
            whileHover={{ scale: 1.02 }}
            className={`rounded-2xl p-8 ${plan.popular
                ? 'popular_pricing'
                : 'normal_pricing'
              }`}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-medium">{plan.name}</h3>
                <p className="text-sm text-gray-500">{plan.description}</p>
              </div>
              {plan.popular && (
                <span className="px-3 py-1 text-sm text-purple bg-purple/10 rounded-full">
                  Most popular
                </span>
              )}
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-600">{plan.note}</p>
              <div className="flex items-baseline mt-2">
                <span className="text-3xl font-bold">₹{plan.price}</span>
                <span className="text-gray-500 ml-1">{plan.period}</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">{plan.subNote}</p>
            </div>

            <button
              // onClick={() => handleSubscribe(plan)}
              onClick={()=>{
                handleSubscribe({
                  amount:plan.price,
                  product:'Ai courser',
                  // product:{
                  //   title:'ai courser',
                  //   price:100
                  // },
                  firstname:'Ravi',
                  email:`ravi${Math.floor(Math.random()*56)}@gmail.com`,
                  mobile:`85${Math.floor(Math.random()*56000)}485`
                })
              }}
              className={`w-full py-3 rounded-lg font-medium transition-colors ${plan.buttonVariant === 'primary'
                  ? 'bg-purple text-white hover:bg-purple/90'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              {plan.buttonText}
            </button>
          </motion.div>
        ))}
      </div>

      <CheckoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        plan={selectedPlan || plans[0]}
      />
    </>
  );
}; 