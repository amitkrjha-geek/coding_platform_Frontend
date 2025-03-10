import ProfileSidebar from "@/components/profile/ProfileSidebar";
import SubmissionHistory from "@/components/profile/SubmissionHistory";
import RecentSubmissions from "@/components/profile/RecentSubmissions";
import ProfileStats from "@/components/profile/ProfileStats";
import PaymentHistory from "@/components/profile/PaymentHistory";

const ProfilePage = () => {
    return (
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
            <div className="flex flex-col lg:flex-row gap-4">
                {/* Left Sidebar */}
                <div className="w-full lg:w-[19rem] min-w-[19rem] bg-white p-3 sm:p-4 rounded-lg">
                    <ProfileSidebar />
                </div>

                {/* Main Content */}
                <div className="flex-1 w-full space-y-4 sm:space-y-6 overflow-hidden">
                    <ProfileStats />
                    <SubmissionHistory />
                    <RecentSubmissions />
                    <PaymentHistory />
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;