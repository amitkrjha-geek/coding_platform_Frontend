'use client'
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react'
import GridBackground from '@/components/shared/GridBackground';
import TerminalEyebrow from '@/components/shared/TerminalEyebrow';

const PaymentStatusContent = () => {
    const params = useSearchParams();
    const paymentStatus = params.get("status");
    const paymentId = params.get("txnid");

    const isSuccess = paymentStatus === 'success';

    return (
        <div className='relative panel shadow-panel-lg p-8 max-w-md w-full mx-auto space-y-6 overflow-hidden'>
            {/* Top accent */}
            <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${isSuccess ? 'via-neon/60' : 'via-danger/60'} to-transparent`} />

            <div className='text-center space-y-3'>
                {isSuccess ? (
                    <div className='w-16 h-16 rounded-md border border-neon/30 bg-neon/10 flex items-center justify-center mx-auto mb-2 shadow-neon-sm'>
                        <svg className="w-8 h-8 text-neon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                ) : (
                    <div className='w-16 h-16 rounded-md border border-danger/30 bg-danger/10 flex items-center justify-center mx-auto mb-2'>
                        <svg className="w-8 h-8 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                )}
                <TerminalEyebrow className="justify-center inline-flex">
                    {isSuccess ? 'transaction.complete' : 'transaction.failed'}
                </TerminalEyebrow>
                <h1 className='heading-display text-3xl text-htb-text'>
                    Payment <span className={isSuccess ? 'text-neon' : 'text-danger'}>{paymentStatus}</span>
                </h1>
                <p className='text-htb-muted text-sm'>Thank you for your transaction</p>
            </div>

            <div className='space-y-3 border-t border-b border-htb-border py-4'>
                <div className='flex justify-between items-center'>
                    <span className='text-[11px] font-mono uppercase tracking-widest text-htb-muted'>Payment ID</span>
                    <span className='font-mono text-xs text-htb-text truncate max-w-[60%]'>{paymentId}</span>
                </div>
                <div className='flex justify-between items-center'>
                    <span className='text-[11px] font-mono uppercase tracking-widest text-htb-muted'>Status</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded font-mono text-[10px] font-semibold uppercase tracking-widest border ${
                        isSuccess
                            ? 'border-neon/30 bg-neon/10 text-neon'
                            : 'border-danger/30 bg-danger/10 text-danger'
                    }`}>
                        {paymentStatus ? paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1) : 'Unknown'}
                    </span>
                </div>
            </div>

            <div className='flex justify-center'>
                <Link
                    href='/'
                    className='inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-neon text-htb-bg hover:shadow-neon-sm hover:-translate-y-0.5 transition-all font-mono text-xs uppercase tracking-widest font-semibold'
                >
                    <span>Return to Home</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                    </svg>
                </Link>
            </div>
        </div>
    );
};

const LoadingFallback = () => (
    <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-neon shadow-neon-sm"></div>
    </div>
);

const Page = () => {
    return (
        <div className='relative min-h-screen bg-htb-bg flex items-center justify-center p-4 pt-20 overflow-hidden'>
            <GridBackground variant="neon" />
            <div className="relative z-10 w-full">
                <Suspense fallback={<LoadingFallback />}>
                    <PaymentStatusContent />
                </Suspense>
            </div>
        </div>
    );
};

export default Page;
