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
import { useAdminAccess } from "@/hooks/useAdminAccess";

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
  const router = useRouter();
  const { isPrivilegedAdmin, isLoaded } = useAdminAccess();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [allPayments, setAllPayments] = useState<any[]>([]);
  const [allPlans, setAllPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allUsers, setAllUsers] = useState<any[]>([]);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isPrivilegedAdmin) {
      router.replace("/admin/challenges");
      return;
    }
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
  }, [isLoaded, isPrivilegedAdmin, router]);

  if (!isLoaded || !isPrivilegedAdmin) {
    return <Loading />;
  }

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
      <div className="hidden lg:block min-h-screen bg-htb-bg p-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-danger font-medium">Error: {error}</div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="hidden lg:block min-h-screen bg-htb-bg p-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-htb-muted font-mono uppercase tracking-widest">No data available</div>
        </div>
      </div>
    );
  }
  return (
    <div className="hidden lg:block min-h-screen bg-htb-bg p-8">
      <div className="mb-6">
        <span className="terminal-eyebrow">admin.dashboard</span>
        <motion.h1
          className="heading-display text-3xl text-htb-text mt-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          Dashboard
        </motion.h1>
      </div>

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
            icon: <Users className="h-5 w-5 text-neon" />,
            link: "/admin/users",
          },
          {
            title: "Total Challenges",
            value: dashboardData.totals.challenges.toString(),
            icon: <CodeXml className="h-5 w-5 text-neon" />,
            link: "/admin/challenges",
          },
          {
            title: "Total Revenue",
            value: paymentData ? `₹${paymentData.totalRevenue.toLocaleString()}` : "₹ 0",
            icon: <Landmark className="h-5 w-5 text-neon" />,
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
          <div className="flex justify-between items-center mb-4 gap-3 flex-wrap">
            <div>
              <span className="terminal-eyebrow">daily.signups</span>
              <h2 className="text-lg font-bold text-htb-text mt-0.5">Daily User Registrations</h2>
            </div>
            <span className="font-mono text-sm text-htb-muted">
              Total: <span className="text-neon font-semibold tabular-nums">{dashboardData.totals.users}</span>
            </span>
          </div>
          <motion.div className="flex justify-center items-center">
            <DailyUsersChart data={allUsers} />
          </motion.div>
        </MotionCard>

        <MotionCard className="p-6" variants={cardVariants} whileHover="hover">
          <span className="terminal-eyebrow">payment.overview</span>
          <h2 className="text-lg font-bold text-htb-text mt-0.5 mb-4">Payment Overview</h2>
          {paymentData ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-md border border-neon/30 bg-neon/5 p-4">
                  <h3 className="text-[10px] font-mono uppercase tracking-widest font-semibold text-neon">Successful</h3>
                  <p className="font-mono text-2xl font-bold text-htb-text tabular-nums mt-1">{paymentData.successfulTransactions}</p>
                </div>
                <div className="rounded-md border border-sky-400/30 bg-sky-400/5 p-4">
                  <h3 className="text-[10px] font-mono uppercase tracking-widest font-semibold text-sky-300">Total</h3>
                  <p className="font-mono text-2xl font-bold text-htb-text tabular-nums mt-1">{paymentData.totalTransactions}</p>
                </div>
              </div>
              <div className="rounded-md border border-purple-500/30 bg-purple-500/5 p-4">
                <h3 className="text-[10px] font-mono uppercase tracking-widest font-semibold text-purple-300">Total Revenue</h3>
                <p className="font-mono text-3xl font-bold text-htb-text tabular-nums mt-1">₹{paymentData.totalRevenue.toLocaleString()}</p>
              </div>
              {paymentData.statusBreakdown && paymentData.statusBreakdown.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-[11px] font-mono uppercase tracking-widest font-semibold text-htb-muted">Status Breakdown</h4>
                  {paymentData.statusBreakdown.map((status: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-3 rounded-md border border-htb-border bg-htb-bg/40">
                      <span className="capitalize text-htb-text text-sm font-medium">{status._id}</span>
                      <div className="text-right">
                        <span className="font-mono text-sm text-htb-text tabular-nums">{status.count} txns</span>
                        <br />
                        <span className="text-xs text-htb-text-dim font-mono tabular-nums">₹{status.totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex justify-center items-center h-64 text-htb-text-dim font-mono text-sm uppercase tracking-widest">
              No payment data available
            </div>
          )}
        </MotionCard>
      </motion.div>

      {/* Bottom Section */}
      <motion.div
        className="grid grid-cols-2 gap-6 mb-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <MotionCard className="p-6" variants={cardVariants} whileHover="hover">
          <div className="mb-4">
            <span className="terminal-eyebrow">challenges.distribution</span>
            <h2 className="text-lg font-bold text-htb-text mt-0.5">Challenge Distribution</h2>
          </div>
          <ChallengeChart data={dashboardData.challengeStats} />
        </MotionCard>

        <MotionCard className="p-6" variants={cardVariants} whileHover="hover">
          <SubscribersChart data={getSubscriptionStats()} />
        </MotionCard>
      </motion.div>

      <MotionCard className="p-6" variants={cardVariants} whileHover="hover">
        <div className="flex justify-between items-center mb-5 gap-3 flex-wrap">
          <div>
            <span className="terminal-eyebrow">trending.challenges</span>
            <h2 className="text-lg font-bold text-htb-text mt-0.5">Top Challenges</h2>
          </div>
          <Link
            href="/admin/challenges"
            className="inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-widest font-semibold text-htb-muted hover:text-neon transition-colors"
          >
            See all →
          </Link>
        </div>

        <div className="space-y-3">
          {dashboardData.topChallenges.length > 0 ? (
            dashboardData.topChallenges.map((challenge, index) => (
              <div
                key={challenge._id}
                className="flex items-center justify-between p-4 rounded-md border border-htb-border bg-htb-bg/40 hover:border-neon/30 transition-colors gap-3 flex-wrap"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="shrink-0 flex items-center justify-center font-mono text-xs font-bold rounded-md border border-neon/30 bg-neon/10 h-7 w-7 text-neon tabular-nums">
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-medium text-htb-text truncate">{challenge.title}</h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-htb-text-dim font-mono uppercase tracking-wider mt-1">
                      <span>
                        Subs: <span className="text-htb-text font-semibold tabular-nums">{challenge.submissions.toLocaleString()}</span>
                      </span>
                      <span>
                        Diff: <span className="text-htb-text font-semibold capitalize">{challenge.difficulty}</span>
                      </span>
                      <span>
                        Created: <span className="text-htb-text font-semibold">{new Date(challenge.createdAt).toLocaleDateString()}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-1.5 shrink-0">
                  <Link href={`/admin/challenges/view?id=${challenge._id}`}>
                    <button className="px-3 py-1.5 rounded border border-neon/30 bg-neon/10 text-neon hover:bg-neon/15 hover:border-neon/40 font-mono text-[11px] uppercase tracking-widest font-semibold transition-colors">
                      View
                    </button>
                  </Link>
                  <Link href={`/admin/challenges/edit?id=${challenge._id}`}>
                    <button className="px-3 py-1.5 rounded border border-htb-border bg-htb-panel text-htb-muted hover:text-htb-text hover:border-htb-border-hover font-mono text-[11px] uppercase tracking-widest font-semibold transition-colors">
                      Edit
                    </button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-htb-text-dim py-8 font-mono text-sm uppercase tracking-widest">
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
    <MotionCard className="p-5 cursor-pointer" variants={cardVariants} whileHover="hover">
      <motion.div
        className="flex flex-col justify-between gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        onClick={() => {
          if (link) {
            router.push(link);
          }
        }}
      >
        <div className="flex justify-between items-start">
          <span className="terminal-eyebrow">{title.toLowerCase().replace(/\s+/g, '.')}</span>
          <motion.div
            className="w-10 h-10 rounded-md border border-neon/30 bg-neon/10 text-neon flex items-center justify-center"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            {icon}
          </motion.div>
        </div>
        <div>
          <p className="text-sm text-htb-muted">{title}</p>
          <motion.h3
            className="font-mono text-3xl font-bold text-htb-text tabular-nums mt-1"
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
