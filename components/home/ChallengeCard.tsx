import { Star } from "lucide-react";
import { memo } from "react";
import { useRouter } from "next/navigation";

interface ChallengeCardProps {
    title: string;
    difficulty: string;
    submissions: string;
    acceptanceRate: string;
    id: string;
}

const difficultyConfig = {
    easy: {
        text: 'text-green-700',
        bg: 'bg-green-50',
        border: 'border-green-100'
    },
    medium: {
        text: 'text-yellow-700',
        bg: 'bg-yellow-50',
        border: 'border-yellow-100'
    },
    hard: {
        text: 'text-red-700',
        bg: 'bg-red-50',
        border: 'border-red-100'
    }
} as const;

const ChallengeCard = memo(({ title, difficulty, submissions, acceptanceRate, id }: ChallengeCardProps) => {
    const router = useRouter();

    const handleStartChallenge = () => {
        router.push(`/${id}`);
    };

    const getDifficultyStyles = (level: string) => {
        const config = difficultyConfig[level.toLowerCase() as keyof typeof difficultyConfig];
        return config || {
            text: 'text-gray-700',
            bg: 'bg-gray-50',
            border: 'border-gray-100'
        };
    };

    return (
        <div className="p-4 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow animate-fadeIn">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                    <div className="flex items-center space-x-4 mt-2">
                        {difficulty && (
                            <span
                                className={`px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize
                                ${getDifficultyStyles(difficulty).text}
                                ${getDifficultyStyles(difficulty).bg}
                                ${getDifficultyStyles(difficulty).border}`}
                            >
                                {difficulty}
                            </span>
                        )}
                    </div>
                </div>
                <button className="text-gray-400 hover:text-yellow-400 transition-colors">
                    <Star className="w-5 h-5" />
                </button>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
                <div>
                    <span className="font-medium">Submissions:</span> {submissions}
                </div>
                <div>
                    <span className="font-medium">Acceptance Rate:</span> {acceptanceRate}
                </div>
            </div>
            <button
                onClick={handleStartChallenge}
                className="w-full mt-4 py-2 rounded-md bg-purple-100 text-purple-600 font-medium hover:bg-purple-200 transition-all duration-300"
            >
                Start Challenge
            </button>
        </div>
    );
});

ChallengeCard.displayName = 'ChallengeCard';

export default ChallengeCard;