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

const ChallengeCard = memo(({ title, difficulty, submissions, acceptanceRate, id }: ChallengeCardProps) => {
    const router = useRouter();

    const handleStartChallenge = () => {
        router.push(`/${id}`);
    };

    return (
        <div className="p-4 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow animate-fadeIn">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                    <div className="flex items-center space-x-4 mt-2">
                        <span className={`text-sm ${difficulty === 'Easy' ? 'text-green-500' : 'text-yellow-500'}`}>
                            {difficulty}
                        </span>
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