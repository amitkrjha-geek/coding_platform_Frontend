"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Clock4, Cpu } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Submission {
    id: number
    status: "Accepted" | "Wrong Answer" | "Time Limit Exceeded" | "Runtime Error"
    timestamp: string
    language: string
    runtime: string
    memory: string
}

const submissions: Submission[] = [
    {
        id: 1,
        status: "Accepted",
        timestamp: "a minute ago",
        language: "C++",
        runtime: "59 ms",
        memory: "32.9 MB",
    },
    {
        id: 2,
        status: "Wrong Answer",
        timestamp: "2 minutes ago",
        language: "Python",
        runtime: "N/A",
        memory: "N/A",
    },
    {
        id: 3,
        status: "Accepted",
        timestamp: "Sep 27, 2024",
        language: "Java",
        runtime: "87 ms",
        memory: "31.5 MB",
    },
    {
        id: 4,
        status: "Time Limit Exceeded",
        timestamp: "5 minutes ago",
        language: "JavaScript",
        runtime: "N/A",
        memory: "N/A",
    },
    {
        id: 5,
        status: "Runtime Error",
        timestamp: "10 minutes ago",
        language: "Go",
        runtime: "N/A",
        memory: "N/A",
    },
    {
        id: 6,
        status: "Accepted",
        timestamp: "15 minutes ago",
        language: "Rust",
        runtime: "45 ms",
        memory: "28.7 MB",
    },
]

const statuses = ["All", "Accepted", "Wrong Answer", "Time Limit Exceeded", "Runtime Error"]
const languages = ["All", "C++", "Python", "Java", "JavaScript", "Go", "Rust"]

const SubmissionsTab = () => {
    const [selectedStatus, setSelectedStatus] = useState("All")
    const [selectedLanguage, setSelectedLanguage] = useState("All")

    const filteredSubmissions = submissions.filter(
        (submission) =>
            (selectedStatus === "All" || submission.status === selectedStatus) &&
            (selectedLanguage === "All" || submission.language === selectedLanguage),
    )

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Accepted":
                return "text-neon";
            case "Wrong Answer":
                return "text-danger";
            case "Time Limit Exceeded":
                return "text-warn";
            default:
                return "text-orange-400";
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
            <div className="rounded-md">
                <div className="grid grid-cols-4 gap-4 items-center text-[11px] font-mono uppercase tracking-widest text-htb-muted border-b border-htb-border pb-2">
                    <div className="flex items-center gap-1">
                        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                            <SelectTrigger className="w-[140px] h-8 font-mono text-xs">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                {statuses.map((status) => (
                                    <SelectItem key={status} value={status}>
                                        {status}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center gap-1">
                        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                            <SelectTrigger className="w-[140px] h-8 font-mono text-xs">
                                <SelectValue placeholder="Language" />
                            </SelectTrigger>
                            <SelectContent>
                                {languages.map((language) => (
                                    <SelectItem key={language} value={language}>
                                        {language}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center gap-1">
                        Runtime
                    </div>
                    <div className="flex items-center gap-1">
                        Memory
                    </div>
                </div>
                <div>
                    {filteredSubmissions.map((submission) => (
                        <div
                            key={submission.id}
                            className="grid grid-cols-4 gap-4 p-3 text-sm items-center border-b border-htb-border last:border-0 hover:bg-neon/5 transition-colors"
                        >
                            <div>
                                <div className={`font-medium ${getStatusColor(submission.status)}`}>
                                    {submission.status}
                                </div>
                                <div className="text-htb-text-dim text-[10px] font-mono uppercase tracking-wider mt-0.5">
                                    {submission.timestamp}
                                </div>
                            </div>
                            <div>
                                <Badge variant="info" className="font-mono">
                                    {submission.language}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-htb-muted font-mono text-xs">
                                <Clock4 className="size-3.5 text-htb-text-dim" />
                                <span className="tabular-nums">{submission.runtime}</span>
                            </div>
                            <div className="flex items-center gap-2 text-htb-muted font-mono text-xs">
                                <Cpu className="size-3.5 text-htb-text-dim" />
                                <span className="tabular-nums">{submission.memory}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    )
}

export default SubmissionsTab

