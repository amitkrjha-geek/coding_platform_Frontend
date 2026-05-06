import PricingHeader from "@/components/billing/PricingHeader"
import Faq from '@/components/billing/FAQ'
import { PricingFeatures } from '@/components/billing/PricingFeatures'
import { Testimonials } from "@/components/billing/Testimonials"
import { PricingPlans } from '@/components/billing/PricingPlans'

const Page = () => {
    return (
        <div className="relative -mt-14 bg-htb-bg">
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-20">
                <PricingHeader />
                <PricingPlans />
                <PricingFeatures />
                <Testimonials />
            </div>
            <div className="relative bg-htb-bg-deep border-t border-htb-border py-16 sm:py-20 lg:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Faq />
                </div>
            </div>
        </div>
    )
}

export default Page
