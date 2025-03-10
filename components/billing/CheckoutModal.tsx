"use client";

import React, { useState } from 'react';
import { X, Check, ChevronDown, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCcVisa, FaCcMastercard, FaPaypal } from 'react-icons/fa';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  promoCode?: string;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: {
    name: string;
    price: number;
  };
}

// Update payment methods with proper icons
interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  last4?: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'new',
    name: 'New Payment Method',
    icon: <CreditCard className="w-4 h-4 inline-block mr-2" />
  },
  {
    id: 'visa-1234',
    name: 'Visa',
    icon: <FaCcVisa className="w-5 h-5 inline-block mr-2 text-[#1434CB]" />,
    last4: '1234'
  },
  {
    id: 'mastercard-5678',
    name: 'Mastercard',
    icon: <FaCcMastercard className="w-5 h-5 inline-block mr-2 text-[#EB001B]" />,
    last4: '5678'
  },
  {
    id: 'paypal',
    name: 'PayPal',
    icon: <FaPaypal className="w-4 h-4 inline-block mr-2 text-[#003087]" />
  }
];

const CheckoutModal = ({ isOpen, onClose, plan }: CheckoutModalProps) => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });
  const [promoCode, setPromoCode] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0].id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Data:', { ...formData, promoCode });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-4xl bg-white rounded-2xl shadow-xl"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-medium">Checkout</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 max-h-[calc(85vh-60px)] overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-5 flex flex-col gap-y-5 space-y-5 bg-[#F8F5FF] rounded-xl">
                  {/* Plan Info */}
                  <div className='flex-1'>
                    <div className="bg-[#F8F5FF] rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-black w-10 h-10 rounded flex items-center justify-center">
                          <span className="text-[11px] text-white">Premium</span>
                        </div>
                        <div>
                          <div className="text-[15px]">{plan.name} Subscription</div>
                          <div className="font-semibold text-lg">${plan.price.toFixed(2)}</div>
                        </div>
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-[#F8F5FF] rounded-xl p-4">
                      <h3 className="font-medium mb-4">Order summary</h3>
                      <div className="space-y-3 text-[15px]">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Original Price</span>
                          <span>${plan.price.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Est. Tax</span>
                          <span>$0.00</span>
                        </div>
                      </div>

                      {/* Promotion Code */}
                      <div className="mt-5">
                        <h4 className="text-gray-600 mb-2">Promotion code</h4>
                        <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                          <input
                            type="text"
                            placeholder="Enter code"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            className="w-full sm:w-auto flex-1 px-4 py-2.5 text-[15px] rounded-lg border bg-white focus:outline-none"
                          />
                          <button
                            type="button"
                            className="w-full sm:w-auto whitespace-nowrap px-5 py-2.5 bg-purple text-white text-[15px] rounded-lg hover:bg-purple/90"
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Total */}
                  <div className="bg-[#F8F5FF] rounded-xl p-4">
                    <div className="flex justify-between items-center text-[15px]">
                      <span className="font-medium">Order Total</span>
                      <span className="font-semibold text-lg">${plan.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-7 space-y-7">
                  {/* Payment Method */}
                  <div>
                    <h3 className="font-medium mb-2">Payment Method</h3>
                    <div className="relative">
                      <select
                        value={selectedPayment}
                        onChange={(e) => setSelectedPayment(e.target.value)}
                        className="w-full pl-12 pr-12 py-2.5 rounded-lg bg-[#F8F5FF] border-0 appearance-none focus:outline-none text-[15px]"
                      >
                        {paymentMethods.map((method) => (
                          <option
                            key={method.id}
                            value={method.id}
                            className="flex items-center pl-8"
                          >
                            {method.name} {method.last4 ? `(**** ${method.last4})` : ''}
                          </option>
                        ))}
                      </select>

                      {/* Right chevron icon */}
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <div className="bg-purple/10 rounded-md p-1">
                          <ChevronDown className="w-4 h-4 text-purple" />
                        </div>
                      </div>

                      {/* Left payment method icon */}
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        {paymentMethods.find(m => m.id === selectedPayment)?.icon}
                      </div>
                    </div>
                  </div>

                  {/* Show different form based on selected payment method */}
                  {selectedPayment === 'new' ? (
                    <>
                      {/* Billing Information */}
                      <div>
                        <h3 className="font-medium mb-2">Please fill in your billing information</h3>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <input
                            type="text"
                            name="firstName"
                            placeholder="First name"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="px-4 py-2.5 rounded-lg bg-[#F8F5FF] border-0 focus:outline-none text-[15px]"
                          />
                          <input
                            type="text"
                            name="lastName"
                            placeholder="Last name"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="px-4 py-2.5 rounded-lg bg-[#F8F5FF] border-0 focus:outline-none text-[15px]"
                          />
                        </div>
                        <input
                          type="email"
                          name="email"
                          placeholder="Email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 rounded-lg bg-[#F8F5FF] border-0 focus:outline-none text-[15px]"
                        />
                      </div>

                      {/* Credit Card Information */}
                      <div>
                        <h3 className="font-medium mb-2">Please fill in your credit card information</h3>
                        <div className="space-y-4">
                          <div className="relative">
                            <input
                              type="text"
                              name="cardNumber"
                              placeholder="Card Number"
                              value={formData.cardNumber}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2.5 rounded-lg bg-[#F8F5FF] border-0 focus:outline-none text-[15px]"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <Check className="w-5 h-5 text-green-500" />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <input
                              type="text"
                              name="expiry"
                              placeholder="MM/YY"
                              value={formData.expiry}
                              onChange={handleInputChange}
                              className="px-4 py-2.5 rounded-lg bg-[#F8F5FF] border-0 focus:outline-none text-[15px]"
                            />
                            <input
                              type="text"
                              name="cvv"
                              placeholder="CVV"
                              value={formData.cvv}
                              onChange={handleInputChange}
                              className="px-4 py-2.5 rounded-lg bg-[#F8F5FF] border-0 focus:outline-none text-[15px]"
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="bg-[#F8F5FF] rounded-lg p-4">
                      <p className="text-sm text-gray-600">
                        You&apos;ll be charged using your selected payment method
                      </p>
                    </div>
                  )}

                  {/* Checkout Button */}
                  <div className='flex justify-end'>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-foreground text-white rounded-lg hover:bg-black/90 transition-colors text-[15px]"
                    >
                      Checkout
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CheckoutModal; 