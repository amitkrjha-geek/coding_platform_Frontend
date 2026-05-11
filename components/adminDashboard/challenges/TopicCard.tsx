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

const difficultyClass = (difficulty: string) => {
  switch (difficulty?.toLowerCase()) {
    case "easy":
      return "border-neon/30 bg-neon/10 text-neon";
    case "medium":
      return "border-warn/30 bg-warn/10 text-warn";
    case "hard":
      return "border-danger/30 bg-danger/10 text-danger";
    default:
      return "border-htb-border bg-htb-panel-2 text-htb-muted";
  }
};

export const TopicCard = ({ challenge, onView, onEdit, onDelete, index }: TopicCardProps) => {
  return (
    <Card className="p-4 panel-hover flex flex-col justify-between gap-3">
      <div className="flex justify-between items-start gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-htb-text">
            <span className="text-htb-text-dim font-mono mr-1.5 tabular-nums">{(index + 1).toString().padStart(2, "0")}.</span>
            {challenge?.title}
          </h3>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-mono uppercase tracking-wider text-htb-text-dim mt-2">
            <div>
              Subs: <span className="text-htb-text font-semibold tabular-nums">{challenge?.submissions?.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Payment:</span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded font-mono text-[10px] font-semibold uppercase tracking-widest border ${
                challenge?.paymentMode === "free"
                  ? "border-neon/30 bg-neon/10 text-neon"
                  : "border-purple-500/30 bg-purple-500/10 text-purple-300"
              }`}>
                {challenge?.paymentMode?.toUpperCase() || "FREE"}
              </span>
            </div>
          </div>
          {challenge?.paymentMode === "paid" && challenge?.planId && (
            <div className="flex items-center gap-2 text-xs mt-2">
              <span className="font-mono uppercase tracking-wider text-htb-text-dim">Plan:</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded font-mono text-[10px] font-semibold uppercase tracking-widest border border-purple-500/30 bg-purple-500/10 text-purple-300">
                {challenge.planId.name} · ₹{challenge.planId.price}/{challenge.planId.priceMode}
              </span>
            </div>
          )}
        </div>
        <span className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded font-mono text-[10px] font-semibold uppercase tracking-widest border ${difficultyClass(challenge.difficulty)}`}>
          {challenge?.difficulty}
        </span>
      </div>
      <div className="flex gap-1.5 flex-wrap">
        <Button
          variant="ghost-neon"
          size="sm"
          className="font-mono text-[11px] uppercase tracking-widest"
          onClick={() => onView(challenge?.id || '')}
        >
          View
        </Button>
        <Button
          variant="outline-dim"
          size="sm"
          className="font-mono text-[11px] uppercase tracking-widest"
          onClick={() => onEdit(challenge?.id || '')}
        >
          Edit
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="bg-danger/10 border border-danger/30 text-danger hover:bg-danger/15 font-mono text-[11px] uppercase tracking-widest"
          onClick={() => onDelete(challenge?.id || '')}
        >
          Delete
        </Button>
        <span className={`ml-auto inline-flex items-center px-2 py-1 rounded font-mono text-[10px] font-semibold uppercase tracking-widest border ${
          challenge.status === "active"
            ? "border-neon/30 bg-neon/10 text-neon"
            : "border-danger/30 bg-danger/10 text-danger"
        }`}>
          {challenge?.status}
        </span>
      </div>
    </Card>
  );
};
