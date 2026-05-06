import { Edit2, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

interface PricingCardProps {
  title: string;
  discount: number;
  details: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

const CouponCard = ({
  title,
  discount,
  details,
  onEdit,
  onDelete,
}: PricingCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="w-full panel panel-hover overflow-hidden transition-all duration-300"
    >
      <div className="p-5">
        <div className="flex justify-between items-center mb-4 gap-3 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            <span className="terminal-eyebrow">coupon.code</span>
            <h2 className="font-mono text-xl font-bold text-neon tabular-nums uppercase tracking-widest">
              {title}
            </h2>
          </div>
          <div className="flex gap-1.5 shrink-0">
            {onEdit && (
              <button
                onClick={onEdit}
                className="px-3 py-1.5 rounded-md border border-htb-border bg-htb-panel text-htb-muted hover:text-neon hover:border-neon/40 transition-colors flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest font-semibold"
              >
                <Edit2 className="w-3 h-3" />
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="px-3 py-1.5 rounded-md border border-danger/30 bg-danger/10 text-danger hover:bg-danger/15 transition-colors flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest font-semibold"
              >
                <Trash2 className="w-3 h-3" />
                Delete
              </button>
            )}
          </div>
        </div>

        <div className="border-t border-htb-border pt-4 space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-[11px] font-mono uppercase tracking-widest font-semibold text-htb-muted">
              Discount
            </span>
            <span className="font-mono text-2xl font-bold text-htb-text tabular-nums">
              ₹{discount}
            </span>
          </div>

          <div>
            <h3 className="text-[11px] font-mono uppercase tracking-widest font-semibold text-htb-muted mb-1">
              Details
            </h3>
            <span className="text-sm text-htb-muted">{details}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CouponCard;
