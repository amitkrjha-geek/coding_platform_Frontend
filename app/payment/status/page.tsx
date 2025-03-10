'use client'
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react'

const PaymentStatusContent = () => {
    const params = useSearchParams();
    const paymentStatus = params.get("status");
    const paymentId = params.get("txnid");

    // console.log({paymentStatus, paymentId});

    return (
        <div className='bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-auto space-y-6'>
            <div className='text-center space-y-2'>
                {paymentStatus === 'success' ? (
                    <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                ) : (
                    <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                )}
                <h1 className='text-3xl font-bold text-gray-800'>Payment {paymentStatus}</h1>
                <p className='text-gray-500'>Thank you for your transaction</p>
            </div>

            <div className='space-y-4 border-t border-b border-gray-100 py-4'>
                <div className='flex justify-between items-center'>
                    <span className='text-gray-600'>Payment ID</span>
                    <span className='font-medium text-gray-800'>{paymentId}</span>
                </div>
                <div className='flex justify-between items-center'>
                    <span className='text-gray-600'>Status</span>
                    <span className={`font-medium ${
                        paymentStatus === 'success' ? 'text-green-500' : 'text-red-500'
                    }`}>
                        {paymentStatus ? paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1) : 'Unknown'}
                    </span>
                </div>
            </div>

            <div className='flex justify-center'>
                <Link 
                    href='/' 
                    className='inline-flex items-center justify-center px-6 py-3 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors duration-200 font-medium space-x-2'
                >
                    <span>Return to Home</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                    </svg>
                </Link>
            </div>
        </div>
    );
};

const LoadingFallback = () => (
    <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
    </div>
);

const Page = () => {
    return (
        <div className='min-h-screen bg-gradient-to-b from-white to-purple-50 flex items-center justify-center p-4'>
            <Suspense fallback={<LoadingFallback />}>
                <PaymentStatusContent />
            </Suspense>
        </div>
    );
};

export default Page;
