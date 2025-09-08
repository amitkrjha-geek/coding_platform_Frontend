"use client";

import { formatDateTime } from "@/utils";

// const submissions = [
//   {
//     title: "My Calendar III",
//     timeAgo: "8 hours ago",
//   },
//   {
//     title: "Search in Rotated Sorted Array",
//     timeAgo: "2 years ago",
//   },
//   {
//     title: "Minimum Size Subarray Sum",
//     timeAgo: "2 years ago",
//   },
//   // Add more submissions...
// ];

const RecentSubmissions = ({ currentData }: { currentData: any }) => {
  const submissions = currentData?.slice(0, 3);
  return (
    <div className="bg-white rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-medium">Recent Submissions</h3>
        {submissions?.length > 0 && <button className="text-sm text-purple hover:underline">
          View all submissions
        </button>}
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