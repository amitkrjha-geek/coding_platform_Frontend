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
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
  hover: {
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
};

const MotionCard = motion(Card);

export default function Page() {
  return (
    <div className="hidden lg:block min-h-screen bg-gray-50 p-7">
       <div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            
            <BreadcrumbItem>
              <BreadcrumbPage>Analytics</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <motion.h1
        className="heading mb-6 mt-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        Analytics
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
            value: "100",
            icon: <Users className="h-5 w-5 text-[#742193]" />,
          },
          {
            title: "Total Challenges",
            value: "100",
            icon: <CodeXml className="h-5 w-5 text-[#742193]" />,
          },
          {
            title: "Total Revenue",
            value: "100",
            icon: <Landmark className="h-5 w-5 text-[#742193]" />,
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
            <h2 className="font-bold text-xl">Users</h2>
            <h2 className="font-bold text-xl">Total Users : 100</h2>
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
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center text-sm font-semibold rounded-full bg-purple-100 h-5 w-5  text-purple-600">
                  {index}
                </span>
                <div>
                  <h3 className="font-medium">3151: Special Array I</h3>
                  <div className="flex gap-6 text-sm text-gray-600">
                    <span>
                      Submissions: <strong>558.9K</strong>
                    </span>
                    <span>
                      Acceptance Rate: <strong>53.8%</strong>
                    </span>
                    <span>
                      Starred: <strong>558.9K</strong>
                    </span>
                    <span>
                      Views: <strong>558.9K</strong>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <span className="px-2 py-1 text-sm text-green-600 bg-green-50 rounded">
                  Easy
                </span>
                <div className="flex gap-1">
                  <button className="px-4 py-1 text-purple-600 bg-purple-50 rounded hover:bg-purple-100">
                    View
                  </button>
                  <button className="px-4 py-1 text-gray-600 bg-gray-100 rounded hover:bg-gray-200">
                    Edit
                  </button>
                  <button className="px-4 py-1 text-red-600 bg-red-50 rounded hover:bg-red-100">
                    Delete
                  </button>
                </div>
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
    <MotionCard className="p-4" variants={cardVariants} whileHover="hover">
      <motion.div
        className="flex flex-col justify-between "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
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
              type: "spring",
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
