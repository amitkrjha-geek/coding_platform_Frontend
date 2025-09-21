import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Challenge {
  id?: string;
  _id?: string;
  title: string;
  difficulty: string;
  submissions: number;
  acceptanceRate: number;
  status: string;
  paymentMode?: string;
  planId?: {
    _id: string;
    name: string;
    price: number;
    priceMode: string;
  } | null;
}
interface TopicCardProps {
  challenge: Challenge;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  index: number;
}

export const TopicCard = ({ challenge, onView, onEdit, onDelete, index }: TopicCardProps) => {  
  return (
    <Card className="p-4 space-y-2 bg-white shadow-sm flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium">{index + 1}. {challenge?.title}</h3>
          <div className="flex gap-4  text-sm text-gray-600 mt-1">
            <div>Submissions: <strong>{challenge?.submissions?.toLocaleString()}</strong></div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Payment:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                challenge?.paymentMode === "free" 
                  ? "bg-green-100 text-green-700" 
                  : "bg-blue-100 text-blue-700"
              }`}>
                {challenge?.paymentMode?.toUpperCase() || "FREE"}
              </span>
            </div>
          </div>
          <div className="flex gap-4 text-sm mt-2">
            
            {challenge?.paymentMode === "paid" && challenge?.planId && (
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Plan:</span>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                  {challenge.planId.name} - ₹{challenge.planId.price}/{challenge.planId.priceMode}
                </span>
              </div>
            )}
          </div>
        </div>
        <span className={`text-sm ${
          challenge.difficulty === "easy"
            ? "text-green-500"
            : challenge.difficulty === "medium"
            ? "text-yellow-500"
            : "text-red-500"
        }`}>
          {challenge?.difficulty}
        </span>
      </div>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          className="bg-purple-50 hover:bg-purple-100 text-purple-700"
          onClick={() => onView(challenge?.id || '')}
        >
          View
        </Button>
        <Button
          variant="secondary"
          className="bg-gray-100 hover:bg-gray-200"
          onClick={() => onEdit(challenge?.id || '')}
        >
          Edit
        </Button>
        <Button
          variant="secondary"
          className="bg-red-50 hover:bg-red-100 text-red-600"
          onClick={() => onDelete(challenge?.id || '')} 
        >
          Delete
        </Button>
        <Button
          variant="secondary"
          className={`text-sm ${
            challenge.status === "active"
              ? "text-green-500"
              : "text-red-500"
          } capitalize`}>
          {challenge?.status}
        </Button>
      </div>
    </Card>
  );
};