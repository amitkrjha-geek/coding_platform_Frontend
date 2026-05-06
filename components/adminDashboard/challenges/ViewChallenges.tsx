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

  const handleEditChallenge = () => {
    router.push(`/admin/challenges/edit?id=${id}`);
  };

  useEffect(() => {
    const getSingleChallenge = async () => {
      try {
        setLoading(true);
        const res = await getChallengeById(String(id));
        // console.log({res});
        
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
    <section className="bg-htb-bg min-h-screen p-7">
      <div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin" className="text-htb-muted hover:text-neon font-mono text-xs uppercase tracking-widest">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-htb-text-dim" />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/challenges" className="text-htb-muted hover:text-neon font-mono text-xs uppercase tracking-widest">Challenges</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-htb-text-dim" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-neon font-mono text-xs uppercase tracking-widest">View Challenge</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <SectionHeader
        title="View Challenge"
        buttonText="Edit Challenge"
        onButtonClick={handleEditChallenge}
        icon={<Pencil className="w-3.5 h-3.5" />}
        className="mt-3"
      />

      <div className="mt-5">
        <div className="panel p-6">
          {/* Tabs */}
          <div className="flex gap-2 border-b border-htb-border mb-4">
            <button
              onClick={() => setActiveTab('description')}
              className={`px-4 py-2.5 border-b-2 -mb-px font-mono text-xs uppercase tracking-widest font-semibold transition-colors ${activeTab === 'description'
                  ? 'border-neon text-neon'
                  : 'border-transparent text-htb-muted hover:text-htb-text'
                }`}
            >
              Description
            </button>
          </div>

          {/* Content based on active tab */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-htb-text-dim font-mono uppercase tracking-widest text-sm">Loading challenge details...</div>
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
            <div className="flex justify-center items-center py-12">
              <div className="text-htb-text-dim font-mono uppercase tracking-widest text-sm">Challenge not found</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ViewChallenges;