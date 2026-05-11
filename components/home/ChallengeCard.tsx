import { Code, Users, Lock, ArrowRight } from "lucide-react";
import { memo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckoutPage } from "@/components/billing/CheckoutPage";
import { getToken, getCurrentUserId } from "@/config/token";
import toast from "react-hot-toast";
import { getUserPaymentHistory } from "@/API/payment";
import { useUser } from "@clerk/nextjs";

interface ChallengeCardProps {
  title: string;
  difficulty: string;
  submissions: string;
  acceptanceRate: string;
  uniqueSolvers?: number;
  id: string;
  paymentMode?: string;
  planId?: {
    _id: string;
    name: string;
    price: number;
    priceMode: string;
  } | null;
  hasSubscribed?: boolean;
}

const difficultyConfig = {
  easy: {
    text: "text-neon",
    bg: "bg-neon/10",
    border: "border-neon/30",
    dot: "bg-neon",
  },
  medium: {
    text: "text-warn",
    bg: "bg-warn/10",
    border: "border-warn/30",
    dot: "bg-warn",
  },
  hard: {
    text: "text-danger",
    bg: "bg-danger/10",
    border: "border-danger/30",
    dot: "bg-danger",
  },
} as const;

const ChallengeCard = memo(
  ({
    title,
    difficulty,
    submissions,
    id,
    paymentMode,
    planId,
    hasSubscribed = false,
  }: ChallengeCardProps) => {
    const { isSignedIn } = useUser();

    const router = useRouter();
    const token = getToken();
    const userId = getCurrentUserId();

    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [form, setForm] = useState("");
    const [hasPaid, setHasPaid] = useState(false);

    const handleStartChallenge = () => {
      if (!isSignedIn) {
        toast.error("Please login to Start the Challenge");
        router.push("/sign-in");
        return;
      }
      router.push(`/${id}`);
    };

    const handlePayment = () => {
      if (!token) {
        toast.error("Please login to subscribe to a plan");
        setTimeout(() => {
          router.push("/sign-in");
        }, 1000);
        return;
      }

      if (planId) {
        setIsCheckoutOpen(true);
      }
    };

    const handleCheckoutSuccess = (form: string) => {
      // console.log("handleCheckoutSuccess");

      // console.log("handleCheckoutSuccess");
      // console.log("form", form);
      setForm(form);
      setIsCheckoutOpen(false);
    };

    useEffect(() => {
      const formData = document.getElementById(
        "payment_post",
      ) as HTMLFormElement;
      // console.log("formData", formData);
      if (formData) {
        formData.submit();
      }
    }, [form]);

    useEffect(() => {
      const fetchUserSubscriptions = async () => {
        try {
          const userSubscriptions = await getUserPaymentHistory(userId || "");
          // console.log("userSubscriptions", userSubscriptions?.data);

          // Filter subscriptions where challengeId is not null
          const paidChallenges =
            userSubscriptions?.data?.filter(
              (subscription: any) =>
                subscription.challengeId !== null &&
                subscription.status === "success",
            ) || [];

          // Check if current challenge has been paid for
          const currentChallengePaid = paidChallenges.some(
            (subscription: any) => subscription.challengeId === id,
          );

          setHasPaid(currentChallengePaid);
        } catch (error) {
          console.error("Error fetching user subscriptions:", error);
        }
      };

      if (userId && token) {
        fetchUserSubscriptions();
      }
    }, [userId, token, id]);

    const getDifficultyStyles = (level: string) => {
      const config =
        difficultyConfig[level.toLowerCase() as keyof typeof difficultyConfig];
      return (
        config || {
          text: "text-htb-muted",
          bg: "bg-htb-panel-2",
          border: "border-htb-border",
          dot: "bg-htb-text-dim",
        }
      );
    };

    const isLocked = paymentMode === "paid" && !hasPaid && !hasSubscribed;
    const diff = getDifficultyStyles(difficulty);

    return (
      <>
        <div className="group relative panel panel-hover overflow-hidden transition-all duration-300">
          {/* Top accent line */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative p-5 space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-mono text-[10px] font-semibold uppercase tracking-widest border ${diff.text} ${diff.bg} ${diff.border}`}
                  >
                    <span
                      className={`block w-1.5 h-1.5 rounded-full ${diff.dot}`}
                    />
                    {difficulty}
                  </span>

                  <span
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-mono text-[10px] font-semibold uppercase tracking-widest border ${
                      paymentMode === "free"
                        ? "bg-neon/10 text-neon border-neon/30"
                        : "bg-purple-500/10 text-purple-300 border-purple-500/30"
                    }`}
                  >
                    {paymentMode === "free" ? "Free" : "Premium"}
                  </span>
                </div>

                <h3 className="text-base font-mono sm:text-lg font-semibold text-htb-text  transition-colors leading-snug line-clamp-2">
                  {title}
                </h3>
              </div>

              {isLocked && (
                <div className="shrink-0 flex items-center justify-center w-9 h-9 rounded-md border border-purple-500/30 bg-purple-500/10 text-purple-300">
                  <Lock className="w-4 h-4" />
                </div>
              )}
            </div>

            {/* Stats row */}
            <div className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-md border border-htb-border bg-htb-bg/50">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center w-7 h-7 rounded border border-htb-border bg-htb-panel-2 text-htb-muted">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-mono font-semibold text-htb-text text-sm tabular-nums">
                    {submissions}
                  </div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-htb-text-dim">
                    Submissions
                  </div>
                </div>
              </div>

              {paymentMode === "paid" && planId && (
                <div className="text-right">
                  <div className="font-mono text-[11px] font-semibold text-purple-300 truncate max-w-[140px]">
                    {planId.name.trim()}
                  </div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-htb-text-dim">
                    ₹{planId.price} · {planId.priceMode}
                  </div>
                </div>
              )}
            </div>

            {/* Action button */}
            {isLocked ? (
              <button
                onClick={handlePayment}
                className="group/btn relative w-full overflow-hidden bg-purple-700 hover:bg-purple-600 text-white font-mono text-xs uppercase tracking-widest font-semibold py-3 rounded-md transition-all duration-300 hover:shadow-violet-glow flex items-center justify-center gap-2"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Subscribe to Access</span>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
              </button>
            ) : (
              <button
                onClick={handleStartChallenge}
                className="group/btn relative w-full overflow-hidden bg-neon hover:bg-neon-green-dim text-htb-bg font-mono text-xs uppercase tracking-widest font-semibold py-3 rounded-md transition-all duration-300 hover:shadow-neon-sm flex items-center justify-center gap-2"
              >
                <Code className="w-3.5 h-3.5" />
                <span>Start Challenge</span>
                <ArrowRight className="w-3.5 h-3.5 -translate-x-1 opacity-0 group-hover/btn:translate-x-0 group-hover/btn:opacity-100 transition-all duration-300" />
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-htb-bg/15 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
              </button>
            )}
          </div>

          {/* Bottom accent */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
        </div>

        {/* Payment Form */}
        {form && (
          <div
            dangerouslySetInnerHTML={{ __html: form }}
            style={{ display: "none" }}
          />
        )}

        {/* Checkout Modal */}
        {isCheckoutOpen && planId && (
          <CheckoutPage
            plan={{
              _id: planId?._id || "",
              name: planId?.name || "",
              price: planId?.price || 0,
              priceMode: planId?.priceMode || "",
              popular: false,
              details: [],
            }}
            challengeId={id}
            onClose={() => setIsCheckoutOpen(false)}
            onSuccess={handleCheckoutSuccess}
          />
        )}
      </>
    );
  },
);

ChallengeCard.displayName = "ChallengeCard";

export default ChallengeCard;
