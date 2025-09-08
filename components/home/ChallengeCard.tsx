import { Star, Code, Users, TrendingUp } from "lucide-react";
import { memo } from "react";
import { useRouter } from "next/navigation";

interface ChallengeCardProps {
    title: string;
    difficulty: string;
    submissions: string;
    acceptanceRate: string;
    uniqueSolvers?: number;
    id: string;
}

const difficultyConfig = {
    easy: {
        text: 'text-green-700',
        bg: 'bg-green-100',
        border: 'border-green-200',
        icon: '🟢'
    },
    medium: {
        text: 'text-yellow-700',
        bg: 'bg-yellow-100',
        border: 'border-yellow-200',
        icon: '🟡'
    },
    hard: {
        text: 'text-red-700',
        bg: 'bg-red-100',
        border: 'border-red-200',
        icon: '🔴'
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
            bg: 'bg-gray-100',
            border: 'border-gray-200',
            icon: '⚪'
        };
    };

    const getDifficultyIcon = (level: string) => {
        const config = difficultyConfig[level.toLowerCase() as keyof typeof difficultyConfig];
        return config?.icon || '⚪';
    };

    return (
        <div className="group relative bg-white rounded-xl border border-gray-200 hover:border-purple-200 hover:shadow-xl transition-all duration-300 overflow-hidden">
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/0 to-blue-50/0 group-hover:from-purple-50/50 group-hover:to-blue-50/50 transition-all duration-300 pointer-events-none" />
            
            <div className="relative p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors mb-3 line-clamp-2 leading-tight">
                            {title}
                        </h3>
                        <div className="flex items-center gap-3">
                            <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border-2 capitalize
                                ${getDifficultyStyles(difficulty).text}
                                ${getDifficultyStyles(difficulty).bg}
                                ${getDifficultyStyles(difficulty).border}`}
                            >
                                <span className="text-xs">{getDifficultyIcon(difficulty)}</span>
                                {difficulty}
                            </span>
                        </div>
                    </div>
                    
                    {/* Star icon */}
                    {/* <button className="text-gray-300 hover:text-yellow-400 transition-colors p-1">
                        <Star className="w-5 h-5" />
                    </button> */}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                        <div className="p-1.5 bg-blue-100 rounded-lg">
                            <Users className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                            <div className="font-semibold text-gray-900">{submissions}</div>
                            <div className="text-xs text-gray-500">Submissions</div>
                        </div>
                    </div>
                    {/* <div className="flex items-center gap-2 text-sm">
                        <div className="p-1.5 bg-purple-100 rounded-lg">
                            <Users className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                            <div className="font-semibold text-gray-900">{uniqueSolvers}</div>
                            <div className="text-xs text-gray-500">Solved</div>
                        </div>
                    </div> */}
                    <div className="flex items-center gap-2 text-sm">
                        <div className="p-1.5 bg-green-100 rounded-lg">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                            <div className="font-semibold text-gray-900">{acceptanceRate}</div>
                            <div className="text-xs text-gray-500">Acceptance</div>
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <button
                    onClick={handleStartChallenge}
                    className="w-full group/btn relative overflow-hidden bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold py-3 px-4 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
                >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        <Code className="w-4 h-4" />
                        Start Challenge
                    </span>
                    {/* Button shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                </button>
            </div>

            {/* Bottom accent line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
        </div>
    );
});

ChallengeCard.displayName = 'ChallengeCard';

export default ChallengeCard;