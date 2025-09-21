"use client";

import React, { useState } from 'react'
import { Bell, Menu, X } from "lucide-react";
import Link from 'next/link';
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from 'next/navigation';
import Image from "next/image";
import NotificationDropdown from "./NotificationDropdown";
// import { auth } from '@clerk/nextjs/server';
import { useAuth, UserButton, useUser } from '@clerk/nextjs';
import { useCheckRole } from '@/hooks/useCheckRole';
import { getCurrentUserId } from '@/config/token';

export default function Navbar() {
    const {user} = useUser();
    const id = getCurrentUserId();
    // console.log("user",user);
    const name = user?.fullName || 'User';
    const avatar = user?.imageUrl || 'https://github.com/shadcn.png';
    const email = user?.emailAddresses[0].emailAddress || 'User@example.com';

    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const pathname = usePathname();
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { checkUserRole } = useCheckRole();

    
     const role = checkUserRole();
  

    const { userId } = useAuth();
        // console.log("userId",userId);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent scroll when menu is open
    React.useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMenuOpen]);

    return (
        <>
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="w-full px-6 h-14 border-b border-gray-200 flex items-center justify-between bg-white fixed top-0 z-50"
            >
                <Link href="/">
                    <h1 className="text-xl font-semibold text-purple">Vio£ethat</h1>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex space-x-8">
                    <Link href="/" className="relative">
                        <span className={`hover:text-purple transition-colors`}>
                            Challenges
                        </span>
                        {pathname === '/' && (
                            <motion.div
                                layoutId="navIndicator"
                                className="absolute bottom-[-16px] left-0 right-0 h-0.5 bg-purple"
                                initial={false}
                            />
                        )}
                    </Link>
                    <Link href="/billing" className="relative">
                        <span className={`hover:text-purple transition-colors`}>
                            Billing
                        </span>
                        {pathname === '/billing' && (
                            <motion.div
                                layoutId="navIndicator"
                                className="absolute bottom-[-16px] left-0 right-0 h-0.5 bg-purple"
                                initial={false}
                            />
                        )}
                    </Link>
                </nav>

                {/* Desktop Icons */}
                <div className="hidden lg:flex items-center space-x-1.5">
                <div className="flex items-center gap-2">
                   

                    {userId ? (
                        <div className='flex items-center'>
                            <UserButton/>
                        </div>
                    ):(

                        <div className="flex items-center gap-4">
                        <Link 
                            href="/sign-in" 
                            className="text-gray-700  rounded-lg px-4 py-2 hover:text-purple-600 transition-colors duration-200 font-medium"
                        >
                            Login
                        </Link>
                        <Link 
                            href="/sign-up" 
                            className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                        >
                            Sign Up
                        </Link>
                    </div>

                    )}
                    
                        </div>
                    <div className="relative">
                        
                        {/* <button
                            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                            className="p-2 hover:bg-gray-100 rounded-full relative"
                        >
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
                        </button> */}
                        {mounted && <NotificationDropdown
                            isOpen={isNotificationsOpen}
                            onClose={() => setIsNotificationsOpen(false)}
                        />}
                    </div>
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link href={`/profile?id=${id}`} className="  rounded-lg px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md">
                           
                        Profile
                        </Link>
                    </motion.div>
                    {role === 'admin' && !pathname.startsWith('/admin') && (
                        <Link href="/admin" className=" rounded-lg px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md">
                             Dashboard
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Button */}

                <div  className="flex items-center gap-4 lg:hidden">

                {userId ? (
                        <div className='flex items-center gap-4'>
                            <UserButton/>
                        </div>
                    ):(

                        <div className="flex items-center gap-4">
                        <Link 
                            href="/sign-in" 
                            className="text-gray-700  rounded-lg px-4 py-2 hover:text-purple-600 transition-colors duration-200 font-medium"
                        >
                            Login
                        </Link>
                        <Link 
                            href="/sign-up" 
                            className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                        >
                            Sign Up
                        </Link>
                    </div>

                    )}
                     

                 <button
                    className=" hover:text-purple transition-colors"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <Menu className="w-6 h-6" />
                </button>

                </div>
               
            </motion.header>

            {/* Mobile Navigation Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black z-50 lg:hidden"
                            onClick={() => setIsMenuOpen(false)}
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-[280px] bg-white z-50 lg:hidden"
                        >
                            <div className="p-3 sm:p-6 ">
                                <div className="flex justify-between items-center mb-8 ">
                                    <h2 className="text-xl font-semibold">Menu</h2>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <X className="w-6 h-6" />
                                    </motion.button>
                                </div>

                                <div className="flex items-center gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
                                    <Link href={`/profile?id=${id}`}>
                                        <div className="relative w-10 h-10">
                                            <Image
                                                src={avatar}
                                                alt="Profile"
                                                fill
                                                className="rounded-full object-cover cursor-pointer"
                                            />
                                        </div>
                                    </Link>
                                    <div>
                                        <p className="font-medium">{name}</p>
                                        <p className="text-sm text-gray-500">{email}</p>
                                    </div>
                                </div>

                                <nav className="flex flex-col gap-1">
                                    <Link
                                        href="/"
                                        className={`block p-4 rounded-lg transition-colors ${pathname === '/' ? 'bg-purple/10 text-purple' : 'hover:bg-gray-50'}`}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Challenges
                                    </Link>
                                    <Link
                                        href="/billing"
                                        className={`block p-4 rounded-lg transition-colors ${pathname === '/billing' ? 'bg-purple/10 text-purple' : 'hover:bg-gray-50'}`}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Billing
                                    </Link>
                                    <Link
                                        href={`/profile?id=${id}`}
                                        className={`block p-4 rounded-lg transition-colors ${pathname === '/profile' ? 'bg-purple/10 text-purple' : 'hover:bg-gray-50'}`}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Profile
                                    </Link>

                                    
                                    {/* <Link
                                        href="/notifications"
                                        className={`block p-4 rounded-lg transition-colors ${pathname === '/notifications' ? 'bg-purple/10 text-purple' : 'hover:bg-gray-50'
                                            }`}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Bell className="w-5 h-5" />
                                            <span>Notifications</span>
                                        </div>
                                    </Link> */}
                                    {role === 'admin' && !pathname.startsWith('/admin') && (
                        <Link href="/admin" className=" rounded-lg text-center  px-2 py-2 bg-purple-600 text-white hover:bg-purple-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md">
                             Dashboard
                        </Link>
                    )}
                                </nav>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}

