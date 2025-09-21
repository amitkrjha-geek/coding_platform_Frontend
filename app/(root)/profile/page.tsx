"use client";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import SubmissionHistory from "@/components/profile/SubmissionHistory";
import RecentSubmissions from "@/components/profile/RecentSubmissions";
import ProfileStats from "@/components/profile/ProfileStats";
import PaymentHistory from "@/components/profile/PaymentHistory";
import { getSubmissionByUserId } from "@/API/submission";
import { useEffect, useState, Suspense } from "react";
import { getCurrentUserId } from "@/config/token";
import { getUserPaymentHistory } from "@/API/payment";

const ProfilePage = () => {
  const userId = getCurrentUserId();
  const [organizedData, setOrganizedData] = useState<any>(null);
  const [currentData, setCurrentData] = useState<any>(null);
  const [paymentHistory, setPaymentHistory] = useState<any>(null);
  const [plan, setPlan] = useState<any>(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const paymentHistory = await getUserPaymentHistory(userId || "");
        // console.log("📊 Payment History:", paymentHistory);
        setPaymentHistory(paymentHistory?.data);

        const subscribedChallenges = paymentHistory?.data?.filter(
          (subscription: any) => 
            subscription.status === "success" && 
            subscription.challengeId === null && 
            subscription.planId?.priceMode !== "Per Challenge"
        ) || [];
        // console.log("subscribedChallenges", subscribedChallenges);

        if (subscribedChallenges.length > 0) {
          // Get the latest subscription based on paymentCompletedAt
          const latestSubscription = subscribedChallenges.reduce((latest: any, current: any) => {
              const latestDate = new Date(latest.paymentCompletedAt);
              const currentDate = new Date(current.paymentCompletedAt);
              return currentDate > latestDate ? current : latest;
          });

          // console.log("latestSubscription", latestSubscription);
          setPlan(latestSubscription?.planId);


      }
   
        const response = await getSubmissionByUserId(userId || "");
        const submissions = response.data;
        // console.log("📊 Submissions:", submissions);

        const formattedSubmissions = submissions.map((submission: any) => ({
          title: submission?.challenge?.title,
          timeAgo: submission?.createdAt,
        }));
        setCurrentData(formattedSubmissions);

        // Extract and organize data by difficulty
        const organizedData = organizeSubmissionsByDifficulty(submissions);
        setOrganizedData(organizedData);

        // console.log('📊 Submissions organized by difficulty:', organizedData);
      } catch (error) {
        console.log("❌ Error fetching submissions:", error);
      }
    };
    fetchSubmissions();
  }, [userId]);

  // Function to organize submissions by difficulty
  const organizeSubmissionsByDifficulty = (submissions: any[]) => {
    const organized = {
      easy: [] as any[],
      medium: [] as any[],
      hard: [] as any[],
      total: submissions.length,
    };

    submissions.forEach((submission) => {
      const difficulty =
        submission.challenge?.difficulty?.toLowerCase() || "unknown";

      // Group by difficulty
      if (difficulty === "easy") {
        organized.easy.push(submission);
      } else if (difficulty === "medium") {
        organized.medium.push(submission);
      } else if (difficulty === "hard") {
        organized.hard.push(submission);
      }
    });

    // Calculate average score

    return organized;
  };

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left Sidebar */}
        <div className="w-full lg:w-[19rem] min-w-[19rem] bg-white p-3 sm:p-4 rounded-lg">
          <ProfileSidebar organizedData={organizedData} />
        </div>

        {/* Main Content */}
        <div className="flex-1 w-full space-y-4 sm:space-y-6 overflow-hidden">
          <ProfileStats organizedData={organizedData} plan={plan}/> 
          <Suspense fallback={<div className="bg-white rounded-xl p-6"><div className="h-[300px] bg-gray-100 rounded-lg animate-pulse" /></div>}>
            <SubmissionHistory />
          </Suspense>
          <RecentSubmissions currentData={currentData} />
          <PaymentHistory paymentHistory={paymentHistory} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
