"use client";

import { formatDateTime } from "@/utils";
import { useRouter } from "next/navigation";

const RecentSubmissions = ({ currentData }: { currentData: any }) => {
  const router = useRouter();
  const submissions = currentData?.slice(0, 3);
  
  
  const handleViewAll = () => {
    router.push('/submissions');
  };

  return (
    <div className="bg-white rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-medium">Recent Submissions</h3>
        {submissions?.length > 0 && (
          <button 
            onClick={handleViewAll}
            className="text-sm text-purple hover:underline transition-colors"
          >
            View all submissions
          </button>
        )}
      </div>

      <div className="space-y-4">
        {submissions?.length > 0 ? (
          <>
            {submissions?.map((submission: any, index: any) => (
          <div
            key={index}
            className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-[#F8F5FF] cursor-pointer"
          >
            <span className="text-sm hover:text-purple">{submission?.title}</span>
            <span className="text-sm text-gray-500">{formatDateTime(submission?.timeAgo)}</span>
                </div>
            ))}
          </>
        ) : (
          <div className="text-sm text-gray-500">No submissions found</div>
        )}
      </div>
    </div>
  );
};

export default RecentSubmissions; 