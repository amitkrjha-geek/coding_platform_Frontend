import { Question } from '@/types';
import { motion } from 'framer-motion'
import React from 'react'
import { v4 as uuid } from 'uuid';



const DescriptionTab = ({ questionData }: { questionData: Question }) => {
    const getDifficultyClass = (difficulty: string) => {
        switch (difficulty) {
            case 'Easy':
                return 'bg-green-100 text-green-700';
            case 'Medium':
                return 'bg-yellow-100 text-yellow-700';
            case 'Hard':
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
            <div className='flex items-center justify-between mb-4'>
                <h1 className="text-2xl font-semibold">{questionData.title}</h1>
                <div className="flex items-center gap-3">
                    <span className={`text-sm px-3 py-1 rounded-full ${getDifficultyClass(questionData.difficulty)}`}>
                        {questionData.difficulty}
                    </span>
                </div>
            </div>

            <p className="text-gray-700">{questionData.description}</p>

            <div className="space-y-4">
                <h3 className="font-medium">Examples:</h3>
                {questionData?.examples?.map((example) => (
                    <div key={uuid()} className="bg-gray-50 p-4 rounded-lg space-y-2">
                        <p><span className="font-medium">Input:</span> {example.input}</p>
                        <p><span className="font-medium">Output:</span> {example.output}</p>
                        <p><span className="font-medium">Explanation:</span> {example.explanation}</p>
                    </div>
                ))}
            </div>

            <div>
                <h3 className="font-medium mb-2">Constraints:</h3>
                <ul className="list-disc list-inside space-y-1">
                    {questionData?.constraints?.map((constraint) => (
                        <li key={uuid()} className="text-gray-700">{constraint}</li>
                    ))}
                </ul>
            </div>
        </motion.div>
    )
}

export default DescriptionTab