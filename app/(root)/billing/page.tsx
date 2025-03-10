import PricingHeader from "@/components/billing/PricingHeader"
import Faq from '@/components/billing/FAQ'
import { PricingFeatures } from '@/components/billing/PricingFeatures'
import { Testimonials } from "@/components/billing/Testimonials"
import { PricingPlans } from '@/components/billing/PricingPlans'

const Page = () => {
    return (
        <div className="relative -mt-14">
            <div className="max-w-7xl mx-auto px-4 py-24 space-y-14">
                <PricingHeader />
                <PricingPlans />
                <PricingFeatures />
                <Testimonials />
            </div>
            <div className="bg-white py-7 sm:py-10 md:py-14 lg:py-20 xl:py-24">
                <div className="max-w-7xl mx-auto px-4">
                    <Faq />
                </div>
            </div>
        </div>
    )
}

export default Page