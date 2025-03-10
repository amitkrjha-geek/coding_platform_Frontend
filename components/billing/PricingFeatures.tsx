"use client";

import { motion } from 'framer-motion';
import { features } from '@/constants';

export const PricingFeatures = () => {
  return (
    <div className="relative">
      {/* Horizontal separators */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 hidden md:block" />
      <div className="absolute left-0 right-0 top-1/2 h-px bg-gray-200 hidden md:block" />

      <div className="grid md:grid-cols-2 gap-8">
        {features.map((feature) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex gap-x-3 p-4 relative"
          >
            <feature.icon className="size-5 shrink-0 text-primary" />
            <div>
              <h3 className="font-medium mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
} 