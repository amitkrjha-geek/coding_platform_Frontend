"use client";

import { getUserPaymentHistory } from "@/API/payment";
import ChallengeCard from "./ChallengeCard";
import { ChallengeData } from '@/redux/features/challengeSlice';
import { motion } from 'framer-motion';
import { useEffect, useState } from "react";
import { getCurrentUserId, getToken } from "@/config/token";

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
  const userId = getCurrentUserId();
  const token = getToken();
  const [hasSubscribed, setHasSubscribed] = useState(false);
  
  
  
  
  
  useEffect(() => {
    const fetchUserSubscriptions = async () => {
        try {
            const userSubscriptions = await getUserPaymentHistory(userId || "");
            console.log("userSubscriptions", userSubscriptions?.data);
            
            // Filter for successful subscriptions with non-Per Challenge plans
            const subscribedChallenges = userSubscriptions?.data?.filter(
              (subscription: any) => 
                subscription.status === "success" && 
                subscription.challengeId === null && 
                subscription.planId?.priceMode !== "Per Challenge"
            ) || [];
            
            console.log("subscribedChallenges", subscribedChallenges);

            if (subscribedChallenges.length > 0) {
                // Get the latest subscription based on paymentCompletedAt
                const latestSubscription = subscribedChallenges.reduce((latest: any, current: any) => {
                    const latestDate = new Date(latest.paymentCompletedAt);
                    const currentDate = new Date(current.paymentCompletedAt);
                    return currentDate > latestDate ? current : latest;
                });

                console.log("latestSubscription", latestSubscription);

                // Check if the plan's endDate is after today's date
                const today = new Date();
                const planEndDate = new Date(latestSubscription.planId?.endDate);
                
                console.log("today:", today);
                console.log("planEndDate:", planEndDate);
                console.log("isActive:", planEndDate >= today);

                // Set subscription status based on plan end date
                setHasSubscribed(planEndDate >= today);
            } else {
                setHasSubscribed(false);
            }

        } catch (error) {
            console.error("Error fetching user subscriptions:", error);
        }
    };
    
    if (userId && token) {
        fetchUserSubscriptions();
    }
}, [userId, token]);


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
            paymentMode={challenge.paymentMode}
            planId={challenge.planId}
            hasSubscribed={hasSubscribed}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default ChallengeList;