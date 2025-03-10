import EditChallenge from '@/components/adminDashboard/challenges/EditChallenge'
import React, { Suspense } from 'react'

const Page = () => {
  return (
    <Suspense fallback={<span>Loading...</span>}>
      <EditChallenge />
    </Suspense>
  )
}

export default Page