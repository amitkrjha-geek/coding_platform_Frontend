"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import TerminalEyebrow from "@/components/shared/TerminalEyebrow";
import { faqs } from "./faq-data";

/**
 * Section 14 — FAQ
 *
 * AEO/GEO-friendly structure:
 *   - Each question is an <h3> directly above its <p> answer
 *   - The visible Q/A pairs must mirror the FAQPage JSON-LD verbatim
 *     (see Phase L7). Both pull from `faq-data.ts`.
 *   - When closed, the answer paragraph stays in the DOM (visibility:hidden
 *     via Framer's animate height/opacity) so crawlers still see it.
 *
 * Client Component (accordion state). The Q/A text remains server-rendered
 * inside this client component because the parent ships the data at build.
 */

export default function LandingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="relative border-b border-htb-border bg-htb-bg py-20 sm:py-24 lg:py-28"
    >
      <div className="max-w-3xl mx-auto px-6 lg:px-10">
        {/* Section header */}
        <div className="text-center mb-10 sm:mb-12">
          <TerminalEyebrow className="justify-center inline-flex">
            knowledge.base
          </TerminalEyebrow>
          <h2
            id="faq-heading"
            className="heading-display text-3xl sm:text-4xl lg:text-5xl text-htb-text mt-3"
          >
            Frequently asked questions.
          </h2>
          <p className="text-htb-muted text-base sm:text-lg leading-relaxed mt-4">
            The honest answers — common objections handled up front.
          </p>
        </div>

        {/* Accordion */}
        <ul className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <li key={faq.question}>
                <motion.article
                  className={`panel overflow-hidden transition-colors ${
                    isOpen ? "border-neon/40" : ""
                  }`}
                  initial={false}
                >
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${index}`}
                      id={`faq-heading-${index}`}
                      className="w-full flex items-center justify-between p-5 sm:p-6 text-left group"
                    >
                      <span
                        className={`font-medium pr-4 transition-colors text-sm sm:text-base ${
                          isOpen
                            ? "text-neon"
                            : "text-htb-text group-hover:text-neon"
                        }`}
                      >
                        {faq.question}
                      </span>
                      <span
                        className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-md border transition-all ${
                          isOpen
                            ? "border-neon/40 bg-neon/10 text-neon"
                            : "border-htb-border text-htb-muted group-hover:border-neon/40 group-hover:text-neon"
                        }`}
                        aria-hidden
                      >
                        {isOpen ? (
                          <Minus className="w-4 h-4" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                      </span>
                    </button>
                  </h3>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-panel-${index}`}
                        role="region"
                        aria-labelledby={`faq-heading-${index}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          duration: 0.25,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 sm:px-6 pb-6 -mt-1">
                          <div className="h-px bg-htb-border mb-4" />
                          <p className="text-sm text-htb-muted leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.article>
              </li>
            );
          })}
        </ul>

        {/* Bottom: still have questions */}
        <p className="text-center text-sm text-htb-muted mt-10">
          Still have questions?{" "}
          <a
            href="mailto:violethat@violethat.com"
            className="text-neon hover:text-neon-green-dim font-mono uppercase tracking-widest text-xs font-semibold"
          >
            Ask us directly →
          </a>
        </p>
      </div>
    </section>
  );
}
