import { testimonials } from '@/constants';
import React from 'react';
import { SiAmazon, SiGoogle, SiFacebook, SiLinkedin, SiApple, SiNetflix, SiUber } from 'react-icons/si';
import { v4 as uuid } from 'uuid';

interface CompanyIcon {
  [key: string]: React.ReactElement;
}

const companyIcons: CompanyIcon = {
  'Amazon': <SiAmazon className="w-6 h-6 text-[#FF9900]" />,
  'Google': <SiGoogle className="w-6 h-6 text-[#4285F4]" />,
  'Facebook': <SiFacebook className="w-6 h-6 text-[#1877F2]" />,
  'LinkedIn': <SiLinkedin className="w-6 h-6 text-[#0A66C2]" />,
  'Apple': <SiApple className="w-6 h-6 text-[#555555]" />,
  'Netflix': <SiNetflix className="w-6 h-6 text-[#E50914]" />,
  'Uber': <SiUber className="w-6 h-6 text-black" />
};

export const Testimonials = () => {
  return (
    <div className="space-y-8 md:px-4 py-12">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
        What others are saying about us?
      </h2>
      <p className="text-gray-600 text-center max-w-2xl mx-auto mb-8 sr-only">
        Join thousands of successful developers who transformed their careers through our platform
      </p>

      <div className="flex flex-wrap justify-center gap-6">
        {testimonials.map((testimonial) => (
          <div
            key={uuid()}
            className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] bg-white rounded-xl border hover:testimonial-card-shadow transition-shadow duration-200 p-6"
          >
            {/* Company Icons */}
            <div className="flex flex-wrap gap-3 mb-4">
              {testimonial.companies.map((company) => (
                <div key={company} className="flex items-center gap-2">
                  {companyIcons[company]}
                </div>
              ))}
            </div>

            <p className="text-gray-700 mb-4 text-sm md:text-base">
              {testimonial.content}
            </p>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-medium text-gray-700">
                  {testimonial.author[0]}
                </span>
              </div>
              <div>
                <p className="font-medium">{testimonial.author}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {testimonial.achievement} • {testimonial.yearOfSuccess}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 