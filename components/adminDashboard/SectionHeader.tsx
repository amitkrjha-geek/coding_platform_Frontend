"use client";

import React from "react";

interface SectionHeaderProps {
  title?: string;
  buttonText: string;
  onButtonClick: () => void;
  icon?: React.ReactNode; // Optional icon
  className?: string; // Optional for additional styling
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  buttonText,
  onButtonClick,
  icon,
  className = "",
}) => {
  return (
    <div className={`flex justify-between items-center gap-3 flex-wrap ${className}`}>
      <div>
        <span className="terminal-eyebrow">{title?.toLowerCase().replace(/\s+/g, ".")}</span>
        <h1 className="heading-display text-2xl text-htb-text mt-0.5">{title}</h1>
      </div>
      <button
        onClick={onButtonClick}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-neon text-htb-bg hover:shadow-neon-sm hover:-translate-y-0.5 transition-all font-mono text-xs uppercase tracking-widest font-semibold"
      >
        {icon}
        {buttonText}
      </button>
    </div>
  );
};

export default SectionHeader;
