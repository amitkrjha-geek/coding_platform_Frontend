"use client";

import React, { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import SectionHeader from "@/components/adminDashboard/SectionHeader";
import { useRouter, useSearchParams } from "next/navigation";
import { Pencil } from "lucide-react";
import ChallengeDetails from "@/components/adminDashboard/challenges/ChallengeDetails";
import SubmissionsTable from "@/components/adminDashboard/challenges/SubmissionsTable";



const ViewChallenges = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'description' | 'submissions'>('description');

  console.log("id", id);

  const handleEditChallenge = () => {
    router.push(`/admin/challenges/edit?id=${id}`);
  };

  return (
    <section className="bg-[#f9f9f9] h-50 p-7">
      <div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/challenges">Challenges</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>View Challenge</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <SectionHeader
        title="View Challenge"
        buttonText="Edit Challenge"
        onButtonClick={handleEditChallenge}
        icon={<Pencil />}
        className=""
      />

      <div className="mt-5">
        <div className="min-w-xl mx-auto bg-white rounded-lg shadow p-6">
          {/* Tabs */}
          <div className="flex gap-4 border-b mb-4">
            <button
              onClick={() => setActiveTab('description')}
              className={`px-4 py-2 border-b-2 ${activeTab === 'description'
                  ? 'border-blue-500 font-medium'
                  : 'border-transparent text-gray-500'
                }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('submissions')}
              className={`px-4 py-2 border-b-2 ${activeTab === 'submissions'
                  ? 'border-blue-500 font-medium'
                  : 'border-transparent text-gray-500'
                }`}
            >
              Submissions
            </button>
          </div>

          {/* Content based on active tab */}
          {activeTab === 'description' ? (
            <ChallengeDetails
              title="Making A Large Island"
              difficulty="Hard"
              stats={{
                Accepted: "500.7k",
                Submissions: "558.5k",
                acceptanceRate: "33.8%"
              }}
            />
          ) : (
            <SubmissionsTable />
          )}
        </div>
      </div>
    </section>
  );
}

export default ViewChallenges;