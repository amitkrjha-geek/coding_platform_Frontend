import { Edit2, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

interface PricingCardProps {
  title: string;
  price: number;
  priceMode: string;
  popular?: boolean;
  details: string[];
  durationDays?: number;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

const PlanCard = ({
  title,
  price,
  priceMode,
  popular = false,
  details,
  durationDays,
  isActive,
  startDate,
  endDate,
  onEdit,
  onDelete,
}: PricingCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`w-full max-w-sm mx-auto panel panel-hover overflow-hidden transition-all duration-300 ${
        popular ? "border-neon/40 shadow-neon-sm" : ""
      }`}
    >
      {/* Header */}
      <div className={`relative px-4 py-3 border-b border-htb-border ${popular ? "bg-neon/10" : "bg-htb-bg/40"}`}>
        <div className="flex justify-between items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 min-w-0">
            <div className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-neon shadow-neon-sm" : "bg-danger"}`}></div>
            <h2 className={`text-base font-bold truncate ${popular ? "text-neon" : "text-htb-text"}`}>
              {title}
            </h2>
            {popular && (
              <span className="bg-neon text-htb-bg text-[10px] font-mono font-semibold uppercase tracking-widest px-2 py-0.5 rounded">
                Popular
              </span>
            )}
          </div>
          <div className="flex gap-1.5 shrink-0">
            {onEdit && (
              <button
                onClick={onEdit}
                className="px-2 py-1 rounded border border-htb-border bg-htb-panel text-htb-muted hover:text-neon hover:border-neon/40 transition-colors flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest font-semibold"
              >
                <Edit2 className="w-3 h-3" />
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="px-2 py-1 rounded border border-danger/30 bg-danger/10 text-danger hover:bg-danger/15 hover:border-danger/40 transition-colors flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest font-semibold"
              >
                <Trash2 className="w-3 h-3" />
                Delete
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Price Section */}
        <div className="flex items-baseline gap-1">
          <div className="font-mono text-3xl font-bold text-htb-text tabular-nums">
            ₹{price.toLocaleString()}
          </div>
          <div className="text-xs text-htb-text-dim font-mono uppercase tracking-wider">
            /{priceMode}
          </div>
        </div>

        {/* Plan Details Grid */}
        <div className="grid grid-cols-2 gap-2">
          {durationDays !== 0 && (
            <div className="rounded-md border border-sky-400/30 bg-sky-400/5 p-2.5">
              <div className="text-[10px] font-mono uppercase tracking-widest font-semibold text-sky-300">
                Duration
              </div>
              <div className="font-mono text-sm font-bold text-htb-text tabular-nums mt-0.5">
                {durationDays} days
              </div>
            </div>
          )}

          <div className={`rounded-md border p-2.5 ${isActive ? "border-neon/30 bg-neon/5" : "border-danger/30 bg-danger/5"}`}>
            <div className={`text-[10px] font-mono uppercase tracking-widest font-semibold ${isActive ? "text-neon" : "text-danger"}`}>
              Status
            </div>
            <div className={`text-sm font-semibold mt-0.5 ${isActive ? "text-neon" : "text-danger"}`}>
              {isActive ? "Active" : "Inactive"}
            </div>
          </div>
        </div>

        {/* Date Range */}
        {startDate && endDate && (
          <div className="rounded-md border border-htb-border bg-htb-bg/40 p-2.5">
            <h4 className="text-[10px] font-mono uppercase tracking-widest font-semibold text-htb-muted mb-2">
              Validity
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-htb-text-dim">Start</div>
                <div className="font-mono text-xs text-htb-text">
                  {new Date(startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-htb-text-dim">End</div>
                <div className="font-mono text-xs text-htb-text">
                  {new Date(endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features Section */}
        <div>
          <h3 className="text-[10px] font-mono uppercase tracking-widest font-semibold text-htb-muted mb-2">
            Features
          </h3>
          <div className="space-y-1.5">
            {details.slice(0, 3).map((detail, index) => (
              <div key={index} className="flex items-center gap-2 text-xs text-htb-muted">
                <div className="w-1 h-1 bg-neon rounded-full flex-shrink-0"></div>
                <span className="truncate">{detail}</span>
              </div>
            ))}
            {details.length > 3 && (
              <div className="text-[11px] text-htb-text-dim font-mono uppercase tracking-wider ml-3">
                +{details.length - 3} more
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PlanCard;
