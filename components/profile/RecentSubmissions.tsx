"use client";

import { formatDateTime } from "@/utils";
import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";

const RecentSubmissions = ({ currentData }: { currentData: any }) => {
  const router = useRouter();
  const submissions = currentData?.slice(0, 3);

  const handleViewAll = () => {
    router.push('/submissions');
  };

  return (
    <div className="panel p-5 sm:p-6">
      <div className="flex items-center justify-between mb-5">
        <span className="terminal-eyebrow">recent.submissions</span>
        {submissions?.length > 0 && (
          <button
            onClick={handleViewAll}
            className="inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-widest font-semibold text-htb-muted hover:text-neon transition-colors"
          >
            View all
            <ArrowUpRight className="w-3 h-3" />
          </button>
        )}
      </div>

      <div className="space-y-2">
        {submissions?.length > 0 ? (
          submissions?.map((submission: any, index: any) => (
            <div
              key={index}
              className="group flex items-center justify-between gap-3 py-2.5 px-3 rounded-md border border-htb-border bg-htb-bg/40 hover:border-neon/30 hover:bg-neon/5 cursor-pointer transition-all"
            >
              <span className="text-sm text-htb-text group-hover:text-neon transition-colors truncate">
                {submission?.title}
              </span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-htb-text-dim shrink-0">
                {formatDateTime(submission?.timeAgo)}
              </span>
            </div>
          ))
        ) : (
          <div className="text-sm text-htb-text-dim font-mono uppercase tracking-wider py-6 text-center border border-dashed border-htb-border rounded-md">
            No submissions found
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentSubmissions;
