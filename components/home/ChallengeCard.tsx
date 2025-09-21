import { Code, Users } from "lucide-react";
import { memo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckoutPage } from "@/components/billing/CheckoutPage";
import { getToken, getCurrentUserId } from '@/config/token';
import toast from 'react-hot-toast';
import { getUserPaymentHistory } from '@/API/payment';

interface ChallengeCardProps {
    title: string;
    difficulty: string;
    submissions: string;
    acceptanceRate: string;
    uniqueSolvers?: number;
    id: string;
    paymentMode?: string;
    planId?: {
        _id: string;
        name: string;
        price: number;
        priceMode: string;
    } | null;
    hasSubscribed?: boolean;
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

const ChallengeCard = memo(({ title, difficulty, submissions, id, paymentMode, planId, hasSubscribed = false  }: ChallengeCardProps) => {
    const router = useRouter();
    const token = getToken();
    const userId = getCurrentUserId();

    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [form, setForm] = useState('');
    const [hasPaid, setHasPaid] = useState(false);

    const handleStartChallenge = () => {
        router.push(`/${id}`);
    };

    const handlePayment = () => {
        if (!token) {
            toast.error("Please login to subscribe to a plan");
            setTimeout(() => {
                router.push("/sign-in");
            }, 1000);
            return;
        }
        
        if (planId) {
            setIsCheckoutOpen(true);
        }
    };

    const handleCheckoutSuccess = (form: string) => {
        console.log("handleCheckoutSuccess");

        console.log("handleCheckoutSuccess");
        // console.log("form", form);
        setForm(form);
        setIsCheckoutOpen(false);
    };

    useEffect(() => {
        const formData = document.getElementById("payment_post") as HTMLFormElement;
        // console.log("formData", formData);
        if (formData) {
            formData.submit();
        }
    }, [form]);

    useEffect(() => {
        const fetchUserSubscriptions = async () => {
            try {
                const userSubscriptions = await getUserPaymentHistory(userId || "");
            // console.log("userSubscriptions", userSubscriptions?.data);
                
                // Filter subscriptions where challengeId is not null
                const paidChallenges = userSubscriptions?.data?.filter(
                    (subscription: any) => subscription.challengeId !== null && subscription.status === "success"
                ) || [];
                
                // Check if current challenge has been paid for
                const currentChallengePaid = paidChallenges.some(
                    (subscription: any) => subscription.challengeId === id
                );
                
                setHasPaid(currentChallengePaid);
            } catch (error) {
                console.error("Error fetching user subscriptions:", error);
            }
        };
        
        if (userId && token) {
            fetchUserSubscriptions();
        }
    }, [userId, token, id]);

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
        <>
            <div className="group relative bg-white rounded-2xl border border-gray-200/60 hover:border-purple-300 hover:shadow-2xl transition-all duration-300 overflow-hidden backdrop-blur-sm">
                {/* Premium gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-transparent to-blue-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <div className="relative p-6 space-y-5">
                    {/* Enhanced Header */}
                    <div className="space-y-3">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors leading-tight">
                            {title}
                        </h3>
                        
                        {/* Professional badges section */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold shadow-sm
                                ${getDifficultyStyles(difficulty).text}
                                ${getDifficultyStyles(difficulty).bg}
                                border-2 ${getDifficultyStyles(difficulty).border}`}
                            >
                                <span className="text-xs">{getDifficultyIcon(difficulty)}</span>
                                {difficulty.toUpperCase()}
                            </span>
                            
                            {/* Enhanced Payment Mode Badge */}
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm border-2 ${
                                paymentMode === "free" 
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                                    : "bg-blue-50 text-blue-700 border-blue-200"
                            }`}>
                                {paymentMode === "free" ? "🆓 FREE" : "💎 PAID"}
                            </span>
                        </div>
                    </div>

                    {/* Enhanced Stats & Plan Info */}
                    <div className="flex items-center justify-between py-3 px-4 bg-gray-50/50 rounded-xl border border-gray-100/80">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-blue-100 rounded-xl shadow-sm">
                                <Users className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                                <div className="font-bold text-gray-900 text-lg">{submissions}</div>
                                <div className="text-xs text-gray-500 font-medium">Submissions</div>
                            </div>
                        </div>
                        
                        {/* Plan Information for Paid Challenges */}
                        {paymentMode === "paid" && planId && (
                            <div className="text-right">
                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200 shadow-sm">
                                    <span className="text-purple-600">📋</span>
                                    {planId.name.trim()} - ₹{planId.price}
                                </div>
                                <div className="text-xs text-gray-500 mt-1 font-medium">
                                    {planId.priceMode}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Enhanced Action Button */}
                    {paymentMode === "paid" && !hasPaid && !hasSubscribed ? (
                        <button
                            onClick={handlePayment}
                            className="w-full group/btn relative overflow-hidden bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 text-white font-bold py-4 px-6 rounded-xl hover:from-purple-700 hover:via-purple-800 hover:to-purple-900 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl shadow-lg border border-purple-500/20"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-3">
                                <span className="text-lg">💳</span>
                                <span className="text-base">Subscribe to Access</span>
                            </span>
                            {/* Enhanced shine effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                        </button>
                    ) : (
                        <button
                            onClick={handleStartChallenge}
                            className="w-full group/btn relative overflow-hidden bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 text-white font-bold py-4 px-6 rounded-xl hover:from-purple-700 hover:via-purple-800 hover:to-purple-900 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl shadow-lg border border-purple-500/20"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-3">
                                <Code className="w-5 h-5" />
                                <span className="text-base">Start Challenge</span>
                            </span>
                            {/* Enhanced shine effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                        </button>
                    )}
                </div>

                {/* Enhanced bottom accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-purple-600 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                
                {/* Premium corner decoration */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-purple-100/50 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Subtle inner shadow for depth */}
                <div className="absolute inset-0 rounded-2xl shadow-inner opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none" />
            </div>
            
            {/* Payment Form */}
            {form && (
                <div
                    dangerouslySetInnerHTML={{ __html: form }}
                    style={{ display: 'none' }}
                />
            )}

            {/* Checkout Modal */}
            {isCheckoutOpen && planId && (
                <CheckoutPage
                    plan={{
                        _id: planId?._id || '',
                        name: planId?.name || '',
                        price: planId?.price || 0,
                        priceMode: planId?.priceMode || '',
                        popular: false,
                        details: []
                    }}
                    challengeId={id}
                    onClose={() => setIsCheckoutOpen(false)}
                    onSuccess={handleCheckoutSuccess}
                />
            )}
        </>
    );
});

ChallengeCard.displayName = 'ChallengeCard';

export default ChallengeCard;