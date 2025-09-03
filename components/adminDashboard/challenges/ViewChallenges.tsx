"use client";

import React, { useEffect, useState } from "react";
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
import { getChallengeById } from "@/API/challenges";

interface FileObject {
  name: string;
  content: string;
  type: string;
  size: number;
  _id: string;
}

interface Challenge {
  _id: string;
  title: string;
  difficulty: string;
  topic: string[];
  keywords: string[];
  problemStatement: string;
  constraints: string[];
  files: FileObject[];
  status: string;
  acceptanceRate: number;
  submissions: number;
  isFeatured: boolean;
  companies: string[];
  createdAt: string;
  __v: number;
}

const ViewChallenges = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'description' | 'submissions'>('description');
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);

  console.log("id", id);

  const handleEditChallenge = () => {
    router.push(`/admin/challenges/edit?id=${id}`);
  };

  useEffect(() => {
    const getSingleChallenge = async () => {
      try {
        setLoading(true);
        const res = await getChallengeById(String(id));
        console.log({res});
        
        if (res) {
          setChallenge(res?.data);
        }
      } catch (error) {
        console.error('Error fetching challenges:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      getSingleChallenge();
    }
  }, [id]);

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
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="text-gray-500">Loading challenge details...</div>
            </div>
          ) : challenge ? (
            activeTab === 'description' ? (
              <ChallengeDetails
                title={challenge?.title}
                difficulty={challenge?.difficulty}
                stats={{
                  Accepted: `${(challenge?.submissions * challenge?.acceptanceRate / 100).toFixed(1)}k`,
                  Submissions: `${(challenge?.submissions / 1000).toFixed(1)}k`,
                  acceptanceRate: `${challenge?.acceptanceRate.toFixed(1)}%`
                }}
                challenge={challenge}
              />
            ) : (
              <SubmissionsTable />
            )
          ) : (
            <div className="flex justify-center items-center py-8">
              <div className="text-gray-500">Challenge not found</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ViewChallenges;