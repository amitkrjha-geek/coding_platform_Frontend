"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: "What do I get with a premium subscription?",
    answer: "Premium subscription includes access to all premium features including video solutions, company-specific questions, interview simulations, and more."
  },
  {
    question: "What are premium solutions? Can I see a sample?",
    answer: "LeetCode offers high-quality official solutions for a large selection of our problems. Some of these solutions are only available to premium subscribers. You can view a sample article here for free."
  },
  {
    question: "How much does the premium subscription cost?",
    answer: "Our premium subscription is available at different pricing tiers. You can choose between monthly, quarterly, or annual plans. The annual plan offers the best value with significant savings."
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Yes, you can cancel your premium subscription at any time. If you cancel, you'll continue to have access to premium features until the end of your billing period."
  },
  {
    question: "Do you offer student discounts?",
    answer: "Yes! We offer special discounts for students with valid .edu email addresses. Contact our support team with your student credentials to get your discount code."
  },
  {
    question: "Can I switch between different subscription plans?",
    answer: "Yes, you can upgrade or downgrade your subscription plan at any time. The changes will take effect at the start of your next billing cycle."
  }
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-center">Frequently asked questions</h2>
      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            className="border border-gray-200 rounded-lg overflow-hidden"
            initial={false}
          >
            <button
              className="w-full flex items-center justify-between p-6"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <span className="font-medium text-left">{faq.question}</span>
              {openIndex === index ? (
                <Minus className="w-5 h-5 text-gray-500" />
              ) : (
                <Plus className="w-5 h-5 text-gray-500" />
              )}
            </button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-6 text-gray-600">{faq.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Faq  