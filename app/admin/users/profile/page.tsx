import ProfileSidebar from "@/components/profile/ProfileSidebar";
import SubmissionHistory from "@/components/profile/SubmissionHistory";
import RecentSubmissions from "@/components/profile/RecentSubmissions";
import ProfileStats from "@/components/profile/ProfileStats";
import PaymentHistory from "@/components/profile/PaymentHistory";

const ProfilePage = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Sidebar */}
                <div className="w-full lg:w-[19rem] bg-white p-4 rounded-lg h-fit">
                    <ProfileSidebar />
                </div>

                {/* Main Content */}
                <div className="flex-1 space-y-6"> 
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