import { testimonials } from '@/constants';
import React from 'react';
import { SiAmazon, SiGoogle, SiFacebook, SiLinkedin, SiApple, SiNetflix, SiUber } from 'react-icons/si';
import { v4 as uuid } from 'uuid';
import TerminalEyebrow from '@/components/shared/TerminalEyebrow';

interface CompanyIcon {
  [key: string]: React.ReactElement;
}

const companyIcons: CompanyIcon = {
  'Amazon': <SiAmazon className="w-5 h-5 text-[#FF9900]" />,
  'Google': <SiGoogle className="w-5 h-5 text-[#4285F4]" />,
  'Facebook': <SiFacebook className="w-5 h-5 text-[#1877F2]" />,
  'LinkedIn': <SiLinkedin className="w-5 h-5 text-[#0A66C2]" />,
  'Apple': <SiApple className="w-5 h-5 text-htb-muted" />,
  'Netflix': <SiNetflix className="w-5 h-5 text-[#E50914]" />,
  'Uber': <SiUber className="w-5 h-5 text-htb-text" />
};

export const Testimonials = () => {
  return (
    <div className="space-y-10">
      <div className="text-center space-y-3">
        <TerminalEyebrow className="justify-center inline-flex">
          field.reports
        </TerminalEyebrow>
        <h2 className="heading-display text-3xl sm:text-4xl text-htb-text">
          What our operators are saying
        </h2>
        <p className="text-htb-muted max-w-2xl mx-auto text-sm sr-only">
          Join thousands of successful developers who transformed their careers
          through our platform
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-5">
        {testimonials.map((testimonial) => (
          <div
            key={uuid()}
            className="group w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] panel panel-hover testimonial-card-shadow p-6 transition-all duration-300"
          >
            {/* Company Icons */}
            <div className="flex flex-wrap gap-3 mb-4 pb-4 border-b border-htb-border">
              {testimonial.companies.map((company) => (
                <div
                  key={company}
                  className="flex items-center justify-center w-9 h-9 rounded border border-htb-border bg-htb-bg/40"
                >
                  {companyIcons[company]}
                </div>
              ))}
            </div>

            <p className="text-htb-muted mb-5 text-sm leading-relaxed">
              &ldquo;{testimonial.content}&rdquo;
            </p>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-neon/30 bg-neon/10 flex items-center justify-center">
                <span className="font-mono text-base font-semibold text-neon">
                  {testimonial.author[0]}
                </span>
              </div>
              <div className="min-w-0">
                <p className="font-medium text-htb-text text-sm truncate">
                  {testimonial.author}
                </p>
                <p className="text-xs text-htb-muted truncate">
                  {testimonial.role}
                </p>
                <p className="text-[10px] font-mono uppercase tracking-wider text-htb-text-dim mt-1 truncate">
                  {testimonial.achievement} · {testimonial.yearOfSuccess}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
