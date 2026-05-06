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
                return 'bg-neon/10 text-neon border-neon/30';
            case 'medium':
                return 'bg-warn/10 text-warn border-warn/30';
            case 'hard':
                return 'bg-danger/10 text-danger border-danger/30';
            default:
                return 'bg-htb-panel-2 text-htb-muted border-htb-border';
        }
    };

    const getDifficultyDot = (difficulty: string) => {
        switch (difficulty.toLowerCase()) {
            case 'easy':
                return 'bg-neon';
            case 'medium':
                return 'bg-warn';
            case 'hard':
                return 'bg-danger';
            default:
                return 'bg-htb-text-dim';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-5"
        >
            {/* Title and Difficulty */}
            <div className="space-y-3">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                    <h1 className="heading-display text-2xl text-htb-text">
                        {challenge.title}
                    </h1>
                    <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded font-mono text-[11px] font-semibold uppercase tracking-widest border ${getDifficultyClass(challenge.difficulty)}`}
                    >
                        <span className={`block w-1.5 h-1.5 rounded-full ${getDifficultyDot(challenge.difficulty)}`} />
                        {challenge.difficulty}
                    </span>
                </div>
            </div>

            {/* Topics */}
            {challenge?.topic?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {challenge?.topic?.map((topic, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center px-2 py-0.5 rounded border border-sky-400/30 bg-sky-400/10 text-sky-300 font-mono text-[11px] uppercase tracking-wider"
                        >
                            {topic.trim()}
                        </span>
                    ))}
                </div>
            )}

            {/* Companies */}
            {challenge?.companies?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {challenge?.companies.map((company, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center px-2 py-0.5 rounded border border-htb-border bg-htb-panel-2 text-htb-muted font-mono text-[11px] uppercase tracking-wider"
                        >
                            {company}
                        </span>
                    ))}
                </div>
            )}

            {/* Problem Statement */}
            <div
                className="problem-statement max-w-none"
                dangerouslySetInnerHTML={{ __html: challenge?.problemStatement }}
            />
        </motion.div>
    )
}

export default DescriptionTab
