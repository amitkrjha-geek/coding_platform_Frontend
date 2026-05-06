"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye } from "lucide-react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import EditChallengeForm from "@/components/adminDashboard/challenges/EditChallengeForm";
import SectionHeader from "@/components/adminDashboard/SectionHeader";

export interface EditChallengeFormProps {
    challengeId: string;
}


const EditChallenge = () => {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const router = useRouter();

    // console.log("id", id);

    const handleViewChallenge = () => {
        router.push(`/admin/challenges/view?id=${id}`);
    };

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
                            <BreadcrumbPage className="text-neon font-mono text-xs uppercase tracking-widest">Edit Challenge</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            <SectionHeader
                title="Edit Challenge"
                buttonText="View Challenge"
                onButtonClick={handleViewChallenge}
                icon={<Eye className="w-3.5 h-3.5" />}
                className="mt-3"
            />

            <div className="mt-5">
                <div className="min-w-xl mx-auto">
                    <EditChallengeForm challengeId={id ?? ''} />
                </div>
            </div>
        </section>
    );
}

export default EditChallenge;
