import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Topic } from "@/types";


interface TopicCardProps {
  topic: Topic;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export const TopicCard = ({ topic, onView, onEdit, onDelete }: TopicCardProps) => {
  return (
    <Card className="p-4 space-y-2 bg-white shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium">{topic.id}. {topic.title}</h3>
          <div className="flex gap-4  text-sm text-gray-600 mt-1">
            <div>Submissions: <strong>{topic.submissions.toLocaleString()}</strong></div>
            <div>Acceptance Rate: <strong>{topic.acceptanceRate}%</strong></div>
          </div>
        </div>
        <span className={`text-sm ${
          topic.difficulty === 'Easy' ? 'text-green-500' :
          topic.difficulty === 'Medium' ? 'text-yellow-500' :
          'text-red-500'
        }`}>
          {topic.difficulty}
        </span>
      </div>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          className="bg-purple-50 hover:bg-purple-100 text-purple-700"
          onClick={() => onView(topic.id)}
        >
          View
        </Button>
        <Button
          variant="secondary"
          className="bg-gray-100 hover:bg-gray-200"
          onClick={() => onEdit(topic.id)}
        >
          Edit
        </Button>
        <Button
          variant="secondary"
          className="bg-red-50 hover:bg-red-100 text-red-600"
          onClick={() => onDelete(topic.id)}
        >
          Delete
        </Button>
      </div>
    </Card>
  );
};