"use client";

import { motion } from 'framer-motion';
import { features } from '@/constants';
import TerminalEyebrow from '@/components/shared/TerminalEyebrow';

export const PricingFeatures = () => {
  return (
    <div className="space-y-10">
      <div className="text-center space-y-3">
        <TerminalEyebrow className="justify-center inline-flex">
          included.in.every.plan
        </TerminalEyebrow>
        <h2 className="heading-display text-3xl sm:text-4xl text-htb-text">
          Built for serious operators
        </h2>
        <p className="text-htb-muted max-w-xl mx-auto text-sm">
          Every subscription tier ships with the same core tooling — the only
          difference is volume and depth of access.
        </p>
      </div>

      <div className="relative">
        {/* Crosshair separators */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-htb-border hidden md:block" />
        <div className="absolute left-0 right-0 top-1/2 h-px bg-htb-border hidden md:block" />

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="group flex gap-4 p-6 relative"
            >
              <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-md border border-neon/30 bg-neon/10 text-neon group-hover:shadow-neon-sm transition-shadow">
                <feature.icon className="size-5" />
              </div>
              <div>
                <h3 className="font-semibold text-htb-text mb-1.5 text-base">
                  {feature.title}
                </h3>
                <p className="text-htb-muted text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
