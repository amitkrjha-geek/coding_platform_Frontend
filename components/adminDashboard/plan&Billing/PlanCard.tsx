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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`w-full  max-w-sm mx-auto bg-white rounded-xl overflow-hidden border shadow-md hover:shadow-lg transition-all duration-300 ${
        popular ? 'border-purple-200 ring-1 ring-purple-100' : 'border-gray-200'
      }`}
    >
      {/* Header with gradient background */}
      <div className={`relative px-4 py-3 ${popular ? 'bg-gradient-to-r from-purple-500 to-purple-600' : 'bg-gradient-to-r from-gray-50 to-gray-100'}`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <h2 className={`text-lg font-bold ${popular ? 'text-white' : 'text-gray-800'}`}>{title}</h2>
            {popular && (
              <span className="bg-white text-purple-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                ⭐
              </span>
            )}
          </div>
          <div className="flex gap-1">
            {onEdit && (
              <button
                onClick={onEdit}
                className={`p-1.5 rounded-md transition-all duration-200 flex items-center gap-1 text-xs font-medium ${
                  popular 
                    ? 'bg-white/20 text-white hover:bg-white/30' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Edit2 className="w-3 h-3" />
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="p-1.5 rounded-md bg-red-100 text-red-600 hover:bg-red-200 transition-all duration-200 flex items-center gap-1 text-xs font-medium"
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
        <div className="flex items-center gap-1 text-start">
          <div className="text-2xl font-bold text-gray-900">
            ₹{price.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500 font-medium">
            /{priceMode}
          </div>
        </div>

        {/* Plan Details Grid */}
        <div className="grid grid-cols-2 gap-2">
          {durationDays !== 0 && (
            <div className="bg-blue-50 rounded-md p-2">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span className="text-xs font-medium text-gray-600">Duration</span>
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {durationDays} days
              </div>
            </div>
          )}
          
          <div className="bg-green-50 rounded-md p-2">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span className="text-xs font-medium text-gray-600">Status</span>
            </div>
            <div className={`text-sm font-semibold ${
              isActive ? 'text-green-700' : 'text-red-700'
            }`}>
              {isActive ? '✓ Active' : '✗ Inactive'}
            </div>
          </div>
        </div>

        {/* Date Range */}
        {startDate && endDate && (
          <div className="bg-gray-50 rounded-md p-2">
            <h4 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
              Validity
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-xs text-gray-500">Start</div>
                <div className="text-xs font-semibold text-gray-900">
                  {new Date(startDate).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">End</div>
                <div className="text-xs font-semibold text-gray-900">
                  {new Date(endDate).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features Section */}
        <div>
          <h3 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
            Features
          </h3>
          <div className="space-y-1">
            {details.slice(0, 3).map((detail, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-xs text-gray-700"
              >
                <div className="w-1 h-1 bg-purple-500 rounded-full flex-shrink-0"></div>
                <span className="truncate">{detail}</span>
              </div>
            ))}
            {details.length > 3 && (
              <div className="text-xs text-gray-500 ml-3">
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