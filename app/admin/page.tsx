"use client";

import { Users, Landmark, CodeXml } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import DailyUsersChart from "@/components/adminDashboard/DailyUsersChart";
// import RevenueChart from "@/components/adminDashboard/RevenueChart";
import SubscribersChart from "@/components/adminDashboard/SubscribersChart";
import ChallengeChart from "@/components/adminDashboard/ChallengeChart";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getDashboardAnalytics } from "@/API/admin";

import { MetricCardProps } from "@/types";
import { getAllPayments, getPaymentStats } from "@/API/payment";
import { getAllPlans } from "@/API/plan";
import { getAllUsers } from "@/API/user";
import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
  hover: {
    scale: 1.02,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 10,
    },
  },
};

const MotionCard = motion(Card);

interface DashboardData {
  totals: {
    users: number;
    challenges: number;
    revenue: number;
  };
  dailyUsers: Array<{
    _id: {
      year: number;
      month: number;
      day: number;
    };
    count: number;
  }>;
  monthlyRevenue: Array<{
    _id: {
      year: number;
      month: number;
    };
    total: number;
  }>;
  challengeStats: Array<{
    _id: string;
    count: number;
    totalSubmissions: number;
  }>;
  topChallenges: Array<{
    _id: string;
    title: string;
    difficulty: string;
    submissions: number;
    createdAt: string;
  }>;
  subscriptionStats: Array<{
    _id: string;
    count: number;
    totalRevenue: number;
  }>;
}

export default function Page() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [allPayments, setAllPayments] = useState<any[]>([]);
  const [allPlans, setAllPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allUsers, setAllUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await getDashboardAnalytics();
        const response2 = await getPaymentStats();
        const response3 = await getAllPayments();
        const response4 = await getAllPlans();
        const response5 = await getAllUsers();
        const formattedUsers = response5?.map((user: any) => ({
          id: user?._id,
          name: user?.name,
          createdAt: user?.createdAt,
        }));
        // console.log({response4});
        setDashboardData(response.data);
        setPaymentData(response2.data);
        setAllPayments(response3.data);
        setAllPlans(response4);
        setAllUsers(formattedUsers);
      } catch (err: any) {
        setError(err.message || "Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Process payment data to get subscription statistics
  const getSubscriptionStats = () => {
    if (!allPayments || allPayments.length === 0) return [];
    
    const planStats = allPayments.reduce((acc: any, payment: any) => {
      const planName = payment.planId?.name || 'Unknown';
      if (!acc[planName]) {
        acc[planName] = {
          _id: planName,
          count: 0,
          totalRevenue: 0
        };
      }
      acc[planName].count += 1;
      acc[planName].totalRevenue += payment.amount || 0;
      return acc;
    }, {});

    return Object.values(planStats) as Array<{
      _id: string;
      count: number;
      totalRevenue: number;
    }>;
  };

  if (loading) {
    return (
      <Loading />
    );
  }

  if (error) {
    return (
      <div className="hidden lg:block min-h-screen bg-gray-50 p-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-red-500">Error: {error}</div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="hidden lg:block min-h-screen bg-gray-50 p-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-xl">No data available</div>
        </div>
      </div>
    );
  }
  return (
    <div className="hidden lg:block min-h-screen bg-gray-50 p-8">
      <motion.h1
        className="heading mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        Dashboard
      </motion.h1>

      {/* Metrics Cards */}
      <motion.div
        className="grid grid-cols-3 gap-10 mb-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {[
          {
            title: "Total Users",
            value: dashboardData.totals.users.toString(),
            icon: <Users className="h-5 w-5 text-[#742193]" />,
            link: "/admin/users",
          },
          {
            title: "Total Challenges",
            value: dashboardData.totals.challenges.toString(),
            icon: <CodeXml className="h-5 w-5 text-[#742193]" />,
            link: "/admin/challenges",
          },
          {
            title: "Total Revenue",
            value: paymentData ? `₹${paymentData.totalRevenue.toLocaleString()}` : "₹ 0",
            icon: <Landmark className="h-5 w-5 text-[#742193]" />,
            link: "/admin",
          },
        ].map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </motion.div>

      {/* Middle Section */}
      <motion.div
        className="grid grid-cols-2 gap-6 mb-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <MotionCard className="p-6" variants={cardVariants} whileHover="hover">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-xl">Daily User Registrations</h2>
            <h2 className="font-bold text-xl">Total Users: {dashboardData.totals.users}</h2>
          </div>
          <motion.div className="flex justify-center items-center">
            <DailyUsersChart data={allUsers} />
          </motion.div>
        </MotionCard>

        <MotionCard className="p-4" variants={cardVariants} whileHover="hover">
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Payment Overview</h2>
            {paymentData ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-green-800">Successful Transactions</h3>
                    <p className="text-2xl font-bold text-green-600">{paymentData.successfulTransactions}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-blue-800">Total Transactions</h3>
                    <p className="text-2xl font-bold text-blue-600">{paymentData.totalTransactions}</p>
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-purple-800">Total Revenue</h3>
                  <p className="text-3xl font-bold text-purple-600">₹{paymentData.totalRevenue.toLocaleString()}</p>
                </div>
                {paymentData.statusBreakdown && paymentData.statusBreakdown.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Status Breakdown:</h4>
                    {paymentData.statusBreakdown.map((status: any, index: number) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="capitalize">{status._id}</span>
                        <div className="text-right">
                          <span className="font-medium">{status.count} transactions</span>
                          <br />
                          <span className="text-sm text-gray-600">₹{status.totalAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex justify-center items-center h-64 text-gray-500">
                No payment data available
              </div>
            )}
          </div>
        </MotionCard>
      </motion.div>

      {/* Bottom Section */}
      <motion.div
        className="grid grid-cols-2 gap-6 mb-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <MotionCard className="p-6 " variants={cardVariants} whileHover="hover">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-xl">Challenge Distribution</h2>
          </div>
          <ChallengeChart data={dashboardData.challengeStats} />
        </MotionCard>

        <MotionCard className=" p-4" variants={cardVariants} whileHover="hover">
          <SubscribersChart data={getSubscriptionStats()} />
        </MotionCard>
      </motion.div>

      <MotionCard className="p-4" variants={cardVariants} whileHover="hover">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Trending Challenges</h2>
          <Link
            href="/admin/challenges"
            className="text-purple-600 hover:underline"
          >
            See all
          </Link>
        </div>

        <div className="space-y-4">
          {dashboardData.topChallenges.length > 0 ? (
            dashboardData.topChallenges.map((challenge, index) => (
              <div
                key={challenge._id}
                className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center text-sm font-semibold rounded-full bg-purple-100 h-5 w-5 text-purple-600">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-medium">{challenge.title}</h3>
                    <div className="flex gap-6 text-sm text-gray-600">
                      <span>
                        Submissions: <strong>{challenge.submissions.toLocaleString()}</strong>
                      </span>
                      <span>
                        Difficulty: <strong>{challenge.difficulty}</strong>
                      </span>
                      <span>
                        Created: <strong>{new Date(challenge.createdAt).toLocaleDateString()}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                 
                  <div className="flex gap-1">
                    <Link href={`/admin/challenges/view?id=${challenge._id}`}>
                      <button className="px-4 py-1 text-purple-600 bg-purple-50 rounded hover:bg-purple-100">
                        View
                      </button>
                    </Link>
                    <Link href={`/admin/challenges/edit?id=${challenge._id}`}>
                      <button className="px-4 py-1 text-gray-600 bg-gray-100 rounded hover:bg-gray-200">
                        Edit
                      </button>
                    </Link>
                    {/* <button className="px-4 py-1 text-red-600 bg-red-50 rounded hover:bg-red-100">
                      Delete
                    </button> */}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-8">
              No challenges available
            </div>
          )}
        </div>
      </MotionCard>
    </div>
  );
}

function MetricCard({ title, value, icon, link }: MetricCardProps) {
  const router = useRouter();
  return (
    <MotionCard className="p-4" variants={cardVariants} whileHover="hover"> 
      <motion.div
        className="flex flex-col justify-between "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        onClick={() => {
          if (link) {
            router.push(link);
          }
        }}
      >
        <div className="flex justify-between ">
          <p className="text-xl font-bold">{title}</p>
          <motion.div
            className="w-10 h-10 rounded-full bg-[#19258d1a] text-purple flex items-center justify-center border border-purple "
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            {icon}
          </motion.div>
        </div>
        <div>
          <motion.h3
            className="text-2xl font-bold "
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring" as const,
              stiffness: 200,
              damping: 10,
            }}
          >
            {value}
          </motion.h3>
        </div>
      </motion.div>
    </MotionCard>
  );
}
