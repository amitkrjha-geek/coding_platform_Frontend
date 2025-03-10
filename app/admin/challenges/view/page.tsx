import ViewChallenges from '@/components/adminDashboard/challenges/ViewChallenges'
import React, { Suspense } from 'react'

const Page = () => {
  return (
    <Suspense fallback={<span>Loading...</span>}>
      <ViewChallenges />
    </Suspense>
  )
}

export default Page