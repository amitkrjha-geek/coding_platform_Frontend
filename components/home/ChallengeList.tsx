"use client";

import ChallengeCard from "./ChallengeCard";
import { ChallengeData } from '@/redux/features/challengeSlice';
import { motion } from 'framer-motion';

const LoadingSkeleton = () => (
  <>
    {[...Array(6)].map((_, index) => (
      <div key={`skeleton-${index}`} className="p-4 border border-gray-200 rounded-lg bg-white">
        <div className="flex justify-between items-start mb-4">
          <div className="w-full">
            <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        </div>
        <div className="h-10 bg-gray-200 rounded w-full animate-pulse mt-4"></div>
      </div>
    ))}
  </>
);

const NoResults = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="col-span-2 text-center py-8"
  >
    <div className="text-gray-500 text-lg">No challenges found</div>
    <p className="text-gray-400 mt-2">Try adjusting your filters or search criteria</p>
  </motion.div>
);

const ChallengeList = ({ challenges, loading }: { challenges: ChallengeData[], loading: boolean }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LoadingSkeleton />
      </div>
    );
  }

  if (!challenges?.length) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NoResults />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {challenges.map((challenge) => (
        <motion.div
          key={challenge._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChallengeCard
            id={challenge._id}
            title={challenge.title}
            difficulty={challenge.difficulty}
            submissions={challenge.submissions.toString()}
            acceptanceRate={`${challenge.acceptanceRate}%`}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default ChallengeList;