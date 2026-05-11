"use client";

import { useState, useEffect } from "react";
import { FileText, Download, Lock, Loader2, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { getToken, getCurrentUserId } from "@/config/token";
import { getUserPaymentHistory } from "@/API/payment";

interface SolutionHintTabProps {
  answerFileUrl: string;
  challengeId: string;
}

const SolutionHintTab = ({
  answerFileUrl,
  challengeId,
}: SolutionHintTabProps) => {
  const router = useRouter();
  const token = getToken();
  const userId = getCurrentUserId();
  const [hasAccess, setHasAccess] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      // Not logged in: no access
      if (!token || !userId) {
        setHasAccess(false);
        setChecking(false);
        return;
      }

      try {
        const paymentHistory = await getUserPaymentHistory(userId);
        const payments = paymentHistory?.data || [];

        // Check 1: User has paid for this specific challenge (Per Challenge)
        const hasPaidForChallenge = payments.some(
          (p: any) =>
            p.status === "success" && p.challengeId === challengeId
        );

        if (hasPaidForChallenge) {
          setHasAccess(true);
          setChecking(false);
          return;
        }

        // Check 2: User has an active subscription plan (Monthly/Yearly)
        const subscriptionPayments = payments.filter(
          (p: any) =>
            p.status === "success" &&
            p.challengeId === null &&
            p.planId?.priceMode !== "Per Challenge"
        );

        if (subscriptionPayments.length > 0) {
          const latestSubscription = subscriptionPayments.reduce(
            (latest: any, current: any) => {
              return new Date(current.paymentCompletedAt) >
                new Date(latest.paymentCompletedAt)
                ? current
                : latest;
            }
          );

          const planEndDate = new Date(latestSubscription.planId?.endDate);
          if (planEndDate >= new Date()) {
            setHasAccess(true);
            setChecking(false);
            return;
          }
        }

        setHasAccess(false);
      } catch (error) {
        console.error("Error checking access:", error);
        setHasAccess(false);
      } finally {
        setChecking(false);
      }
    };

    checkAccess();
  }, [token, userId, challengeId]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = answerFileUrl;
    link.target = "_blank";
    link.download = "solution-hint.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (checking) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="w-7 h-7 text-neon animate-spin mb-3" />
        <p className="text-xs font-mono uppercase tracking-widest text-htb-muted">
          Checking access...
        </p>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center py-14 px-6">
        <div className="w-16 h-16 rounded-md border border-purple-500/30 bg-purple-500/10 flex items-center justify-center mb-4">
          <Lock className="w-6 h-6 text-purple-300" />
        </div>
        <span className="terminal-eyebrow mb-2">premium.access</span>
        <h3 className="text-lg font-semibold text-htb-text mb-2">
          Premium Content
        </h3>
        <p className="text-sm text-htb-muted text-center max-w-sm mb-4 leading-relaxed">
          Solution hints are available exclusively for subscribers and users who
          have purchased this challenge.
        </p>
        <button
          onClick={() => router.push("/billing")}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 hover:border-purple-500/60 transition-colors font-mono text-xs uppercase tracking-widest font-semibold"
        >
          <Crown className="w-3.5 h-3.5" />
          <span>Upgrade to Access</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md border border-neon/30 bg-neon/10 flex items-center justify-center">
            <FileText className="w-4 h-4 text-neon" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-htb-text">
              Solution Hint
            </h3>
            <p className="text-[10px] font-mono uppercase tracking-widest text-htb-text-dim">
              PDF Document
            </p>
          </div>
        </div>
        <Button
          variant="ghost-neon"
          size="sm"
          onClick={handleDownload}
          className="font-mono text-[11px] uppercase tracking-widest"
        >
          <Download className="w-3.5 h-3.5 mr-1.5" />
          Download
        </Button>
      </div>

      {/* PDF Viewer */}
      <div className="border border-htb-border rounded-md overflow-hidden bg-htb-bg-deep">
        <iframe
          src={`${answerFileUrl}#toolbar=1&navpanes=0`}
          className="w-full"
          style={{ height: "calc(100vh - 260px)", minHeight: "500px" }}
          title="Solution Hint PDF"
        />
      </div>
    </div>
  );
};

export default SolutionHintTab;
