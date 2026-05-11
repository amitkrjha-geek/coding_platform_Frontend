"use client";

import { Users, Landmark, CodeXml } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import UserPieChart from "@/components/adminDashboard/userPieChart";
// import RevenueChart from "@/components/adminDashboard/RevenueChart";
// import SubscribersChart from "@/components/adminDashboard/SubscribersChart";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { MetricCardProps } from "@/types";

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

export default function Page() {
  return (
    <div className="hidden lg:block min-h-screen bg-htb-bg p-7">
       <div>
        <Breadcrumb>
          <BreadcrumbList className="text-htb-muted">
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin" className="text-htb-muted hover:text-neon font-mono text-xs uppercase tracking-widest">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-htb-text-dim" />

            <BreadcrumbItem>
              <BreadcrumbPage className="text-neon font-mono text-xs uppercase tracking-widest">Analytics</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="mb-6 mt-4">
        <span className="terminal-eyebrow">admin.analytics</span>
        <motion.h1
          className="heading-display text-3xl text-htb-text mt-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          Analytics
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
            value: "100",
            icon: <Users className="h-5 w-5 text-neon" />,
          },
          {
            title: "Total Challenges",
            value: "100",
            icon: <CodeXml className="h-5 w-5 text-neon" />,
          },
          {
            title: "Total Revenue",
            value: "100",
            icon: <Landmark className="h-5 w-5 text-neon" />,
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
              <span className="terminal-eyebrow">users.distribution</span>
              <h2 className="text-lg font-bold text-htb-text mt-0.5">Users</h2>
            </div>
            <span className="font-mono text-sm text-htb-muted">
              Total: <span className="text-neon font-semibold tabular-nums">100</span>
            </span>
          </div>
          <motion.div className="flex justify-center items-center">
            <UserPieChart />
          </motion.div>
        </MotionCard>

        <MotionCard className="p-4" variants={cardVariants} whileHover="hover">
          {/* <RevenueChart /> */}
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
          {/* <RevenueChart /> */}
          <motion.div
            className="relative w-48 h-4 mx-auto"
            initial={{ rotate: -90 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          ></motion.div>
        </MotionCard>

        <MotionCard className=" p-4" variants={cardVariants} whileHover="hover">
          {/* <SubscribersChart /> */}
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
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 rounded-md border border-htb-border bg-htb-bg/40 hover:border-neon/30 transition-colors gap-3 flex-wrap"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="shrink-0 flex items-center justify-center font-mono text-xs font-bold rounded-md border border-neon/30 bg-neon/10 h-7 w-7 text-neon tabular-nums">
                  {index}
                </span>
                <div className="min-w-0">
                  <h3 className="font-medium text-htb-text">3151: Special Array I</h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-htb-text-dim font-mono uppercase tracking-wider mt-1">
                    <span>Subs: <span className="text-htb-text font-semibold tabular-nums">558.9K</span></span>
                    <span>Accept: <span className="text-htb-text font-semibold tabular-nums">53.8%</span></span>
                    <span>Starred: <span className="text-htb-text font-semibold tabular-nums">558.9K</span></span>
                    <span>Views: <span className="text-htb-text font-semibold tabular-nums">558.9K</span></span>
                  </div>
                </div>
              </div>

              <div className="flex gap-1.5 shrink-0">
                <span className="px-2 py-0.5 rounded font-mono text-[10px] font-semibold uppercase tracking-widest border border-neon/30 bg-neon/10 text-neon">
                  Easy
                </span>
                <button className="px-3 py-1.5 rounded border border-neon/30 bg-neon/10 text-neon hover:bg-neon/15 font-mono text-[11px] uppercase tracking-widest font-semibold transition-colors">
                  View
                </button>
                <button className="px-3 py-1.5 rounded border border-htb-border bg-htb-panel text-htb-muted hover:text-htb-text hover:border-htb-border-hover font-mono text-[11px] uppercase tracking-widest font-semibold transition-colors">
                  Edit
                </button>
                <button className="px-3 py-1.5 rounded border border-danger/30 bg-danger/10 text-danger hover:bg-danger/15 font-mono text-[11px] uppercase tracking-widest font-semibold transition-colors">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </MotionCard>
    </div>
  );
}

function MetricCard({ title, value, icon }: MetricCardProps) {
  return (
    <MotionCard className="p-5" variants={cardVariants} whileHover="hover">
      <motion.div
        className="flex flex-col justify-between gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
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
