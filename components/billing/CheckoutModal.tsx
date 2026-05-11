"use client";

import React, { useState } from "react";
import { X, Check, ChevronDown, CreditCard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCcVisa, FaCcMastercard, FaPaypal } from "react-icons/fa";

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
    id: "new",
    name: "New Payment Method",
    icon: <CreditCard className="w-4 h-4 inline-block mr-2" />,
  },
  {
    id: "visa-1234",
    name: "Visa",
    icon: <FaCcVisa className="w-5 h-5 inline-block mr-2 text-[#1434CB]" />,
    last4: "1234",
  },
  {
    id: "mastercard-5678",
    name: "Mastercard",
    icon: (
      <FaCcMastercard className="w-5 h-5 inline-block mr-2 text-[#EB001B]" />
    ),
    last4: "5678",
  },
  {
    id: "paypal",
    name: "PayPal",
    icon: <FaPaypal className="w-4 h-4 inline-block mr-2 text-[#003087]" />,
  },
];

const CheckoutModal = ({ isOpen, onClose, plan }: CheckoutModalProps) => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [promoCode, setPromoCode] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0].id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data:");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-md bg-htb-bg border border-htb-border text-htb-text font-mono text-sm placeholder:text-htb-text-dim hover:border-htb-border-hover focus:border-neon/60 focus:ring-1 focus:ring-neon/40 outline-none transition-all";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-htb-bg-deep/80 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-4xl panel shadow-panel-lg overflow-hidden"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon/60 to-transparent" />

            <div className="flex items-center justify-between px-6 py-4 border-b border-htb-border">
              <div>
                <span className="terminal-eyebrow">checkout</span>
                <h2 className="text-lg font-semibold text-htb-text">
                  Complete your order
                </h2>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="flex items-center justify-center w-9 h-9 rounded-md border border-htb-border text-htb-muted hover:text-neon hover:border-neon/40 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 max-h-[calc(85vh-72px)] overflow-y-auto"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-5 flex flex-col gap-y-4">
                  {/* Plan Info */}
                  <div className="panel p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-neon w-10 h-10 rounded-md flex items-center justify-center">
                        <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-htb-bg">
                          Pro
                        </span>
                      </div>
                      <div>
                        <div className="text-sm text-htb-text">
                          {plan.name} Subscription
                        </div>
                        <div className="font-mono font-bold text-lg text-htb-text tabular-nums">
                          ${plan.price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="panel p-4">
                    <span className="terminal-eyebrow">order.summary</span>
                    <div className="space-y-3 mt-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-htb-muted">Original Price</span>
                        <span className="font-mono text-htb-text tabular-nums">
                          ${plan.price.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-htb-muted">Est. Tax</span>
                        <span className="font-mono text-htb-text tabular-nums">
                          $0.00
                        </span>
                      </div>
                    </div>

                    {/* Promotion Code */}
                    <div className="mt-5">
                      <h4 className="text-[11px] font-mono uppercase tracking-widest text-htb-muted mb-2">
                        Promotion code
                      </h4>
                      <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                        <input
                          type="text"
                          placeholder="Enter code"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          className={`${inputClass} flex-1 sm:w-auto`}
                        />
                        <button
                          type="button"
                          className="w-full sm:w-auto whitespace-nowrap px-5 py-2.5 bg-htb-panel-2 border border-htb-border text-htb-muted hover:text-neon hover:border-neon/40 font-mono text-xs uppercase tracking-widest font-semibold rounded-md transition-colors"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Order Total */}
                  <div className="panel p-4 border-neon/30 bg-neon/5">
                    <div className="flex justify-between items-baseline">
                      <span className="font-mono text-[11px] uppercase tracking-widest text-htb-muted">
                        Order Total
                      </span>
                      <span className="font-mono text-2xl font-bold text-neon tabular-nums">
                        ${plan.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Payment Method */}
                  <div>
                    <h3 className="text-[11px] font-mono uppercase tracking-widest text-htb-muted mb-2">
                      Payment Method
                    </h3>
                    <div className="relative">
                      <select
                        value={selectedPayment}
                        onChange={(e) => setSelectedPayment(e.target.value)}
                        className="w-full pl-12 pr-12 py-2.5 rounded-md bg-htb-bg border border-htb-border text-htb-text font-mono text-sm appearance-none hover:border-htb-border-hover focus:border-neon/60 focus:ring-1 focus:ring-neon/40 outline-none transition-all"
                      >
                        {paymentMethods.map((method) => (
                          <option
                            key={method.id}
                            value={method.id}
                            className="flex items-center pl-8"
                          >
                            {method.name}{" "}
                            {method.last4 ? `(**** ${method.last4})` : ""}
                          </option>
                        ))}
                      </select>

                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <div className="bg-neon/10 rounded-md p-1">
                          <ChevronDown className="w-4 h-4 text-neon" />
                        </div>
                      </div>

                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        {
                          paymentMethods.find((m) => m.id === selectedPayment)
                            ?.icon
                        }
                      </div>
                    </div>
                  </div>

                  {selectedPayment === "new" ? (
                    <>
                      {/* Billing Information */}
                      <div>
                        <h3 className="text-[11px] font-mono uppercase tracking-widest text-htb-muted mb-2">
                          Billing Information
                        </h3>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <input
                            type="text"
                            name="firstName"
                            placeholder="First name"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className={inputClass}
                          />
                          <input
                            type="text"
                            name="lastName"
                            placeholder="Last name"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className={inputClass}
                          />
                        </div>
                        <input
                          type="email"
                          name="email"
                          placeholder="Email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={inputClass}
                        />
                      </div>

                      {/* Credit Card Information */}
                      <div>
                        <h3 className="text-[11px] font-mono uppercase tracking-widest text-htb-muted mb-2">
                          Credit Card
                        </h3>
                        <div className="space-y-3">
                          <div className="relative">
                            <input
                              type="text"
                              name="cardNumber"
                              placeholder="Card Number"
                              value={formData.cardNumber}
                              onChange={handleInputChange}
                              className={inputClass}
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <Check className="w-4 h-4 text-neon" />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <input
                              type="text"
                              name="expiry"
                              placeholder="MM/YY"
                              value={formData.expiry}
                              onChange={handleInputChange}
                              className={inputClass}
                            />
                            <input
                              type="text"
                              name="cvv"
                              placeholder="CVV"
                              value={formData.cvv}
                              onChange={handleInputChange}
                              className={inputClass}
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="panel p-4">
                      <p className="text-sm text-htb-muted">
                        You&apos;ll be charged using your selected payment
                        method
                      </p>
                    </div>
                  )}

                  {/* Checkout Button */}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-neon text-htb-bg font-mono text-xs uppercase tracking-widest font-semibold rounded-md hover:shadow-neon-sm hover:-translate-y-0.5 transition-all"
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
