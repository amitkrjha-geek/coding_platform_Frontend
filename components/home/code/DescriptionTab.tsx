import { ChallengeData } from '@/redux/features/challengeSlice';
import { motion } from 'framer-motion'
import React from 'react'
import './DescriptionTab.css'

const DescriptionTab = ({ challenge }: { challenge: ChallengeData | undefined }) => {
    if (!challenge) {
        return null;
    }

    const getDifficultyClass = (difficulty: string) => {
        switch (difficulty.toLowerCase()) {
            case 'easy':
                return 'bg-green-100 text-green-700';
            case 'medium':
                return 'bg-yellow-100 text-yellow-700';
            case 'hard':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
        >
            {/* Title and Difficulty */}
            <div className='flex items-center justify-between'>
                <h1 className="text-2xl font-semibold">{challenge.title}</h1>
                <div className="flex items-center gap-3">
                    <span className={`text-sm px-3 py-1 rounded-full capitalize ${getDifficultyClass(challenge.difficulty)}`}>
                        {challenge.difficulty}
                    </span>
                </div>
            </div>

            {/* Topics and Companies */}
            <div className="flex flex-wrap gap-2">
                {challenge?.topic?.map((topic, index) => (
                    <span key={index} className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full">
                        {topic.trim()}
                    </span>
                ))}
            </div>

            {/* Companies */}
            {challenge?.companies?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {challenge?.companies.map((company, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full capitalize">
                            {company}
                        </span>
                    ))}
                </div>
            )}

            {/* Problem Statement */}
            <div
                className="problem-statement prose max-w-none space-y-3
                    prose-h2:text-lg prose-h2:font-normal prose-h2:text-gray-800 prose-h2:mt-4 prose-h2:mb-2
                    prose-pre:bg-gray-50 prose-pre:p-4 prose-pre:rounded-lg prose-pre:text-sm 
                    prose-code:font-mono prose-code:text-sm
                    prose-ul:pl-4 prose-ul:space-y-1 prose-ul:my-2
                    prose-li:text-gray-600
                    prose-p:text-gray-600 prose-p:my-2 prose-p:leading-relaxed"
                dangerouslySetInnerHTML={{ __html: challenge?.problemStatement }}
                style={{
                    ["--tw-prose-headings" as string]: "rgb(31 41 55)",
                    ["--tw-prose-pre" as string]: "rgb(75 85 99)"
                } as React.CSSProperties}
            />

            {/* Stats */}
            <div className="flex gap-4 text-sm text-gray-600">
                <span>Acceptance Rate: {challenge?.acceptanceRate}%</span>
                <span>Submissions: {challenge?.submissions}</span>
            </div>
        </motion.div>
    )
}

export default DescriptionTab