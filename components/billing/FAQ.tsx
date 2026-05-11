"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import TerminalEyebrow from '@/components/shared/TerminalEyebrow';

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
    <div className="space-y-10">
      <div className="text-center space-y-3">
        <TerminalEyebrow className="justify-center inline-flex">
          knowledge.base
        </TerminalEyebrow>
        <h2 className="heading-display text-3xl sm:text-4xl text-htb-text">
          Frequently asked questions
        </h2>
      </div>
      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <motion.div
              key={index}
              className={`panel overflow-hidden transition-colors ${
                isOpen ? 'border-neon/40' : ''
              }`}
              initial={false}
            >
              <button
                className="w-full flex items-center justify-between p-5 sm:p-6 text-left group"
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <span
                  className={`font-medium pr-4 transition-colors ${
                    isOpen ? 'text-neon' : 'text-htb-text group-hover:text-neon'
                  }`}
                >
                  {faq.question}
                </span>
                <span
                  className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-md border transition-all ${
                    isOpen
                      ? 'border-neon/40 bg-neon/10 text-neon'
                      : 'border-htb-border text-htb-muted group-hover:border-neon/40 group-hover:text-neon'
                  }`}
                >
                  {isOpen ? (
                    <Minus className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 sm:px-6 pb-6 -mt-1">
                      <div className="h-px bg-htb-border mb-4" />
                      <p className="text-htb-muted text-sm leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Faq;
