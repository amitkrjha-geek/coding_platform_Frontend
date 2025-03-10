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

    console.log("id", id);

    const handleViewChallenge = () => {
        router.push(`/admin/challenges/view?id=${id}`);
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
                            <BreadcrumbPage>Edit Challenge</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            <SectionHeader
                title="Edit Challenge"
                buttonText="View Challenge"
                onButtonClick={handleViewChallenge}
                icon={<Eye />}
                className=""
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
