"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, Settings2 } from "lucide-react";
import { FaDatabase, FaTerminal, FaJs, FaAngleDoubleRight } from "react-icons/fa";
import { BiNetworkChart } from "react-icons/bi";
import { AiOutlineCode } from "react-icons/ai";
import { BsGrid1X2 } from "react-icons/bs";
import ChallengeList from "./ChallengeList";
import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { createUser } from "@/API/user";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { fetchUsers } from "@/redux/features/userSlice";
import { setToken } from "@/config/token";

const initialTopics = [
  {
    id: "all",
    label: "All Topics",
    icon: BsGrid1X2,
    color: "#6366F1" // Indigo
  },
  {
    id: "algorithms",
    label: "Algorithms",
    icon: AiOutlineCode,
    color: "#F59E0B" // Amber
  },
  {
    id: "database",
    label: "Database",
    icon: FaDatabase,
    color: "#10B981" // Emerald
  },
  {
    id: "shell",
    label: "Shell",
    icon: FaTerminal,
    color: "#EC4899" // Pink
  },
  {
    id: "concurrency",
    label: "Concurrency",
    icon: BiNetworkChart,
    color: "#8B5CF6" // Violet
  },
  {
    id: "javascript",
    label: "JavaScript",
    icon: FaJs,
    color: "#F7DF1E" // JavaScript Yellow
  },
];

const additionalTopics = [
  {
    id: "python",
    label: "Python",
    icon: FaDatabase,
    color: "#3776AB"
  },
  {
    id: "cpp",
    label: "C++",
    icon: AiOutlineCode,
    color: "#00599C"
  },
  {
    id: "java",
    label: "Java",
    icon: FaJs,
    color: "#007396"
  },
  {
    id: "ruby",
    label: "Ruby",
    icon: BiNetworkChart,
    color: "#CC342D"
  }
];

const Challenges = () => {
  const [showMore, setShowMore] = useState(false);
  const topics = showMore ? [...initialTopics, ...additionalTopics] : initialTopics;

  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const dispatch = useAppDispatch();

  // useEffect(() => {
  //   const getJWTToken = async () => {
  //     if (isSignedIn) {
  //       const token = await getToken({ template: "session" });;
  //       if (token) {
  //         setToken(token);
  //         console.log("Clerk JWT Token..:", token);
  //       }
  //     }
  //   };
  //   getJWTToken();
  // }, [isSignedIn, getToken]);

  const { users: allUsers, status } = useAppSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUsers());
    }
  }, [dispatch, status]);

  console.log("allUsers:", allUsers);

  


  useEffect(() => {
    if (isSignedIn && user && allUsers.length > 0) {
      const userEmail = user.primaryEmailAddress?.emailAddress;
      const userExists = allUsers.some(existingUser => existingUser.email === userEmail);

      if (!userExists) {
        const userData = {
          clerkId: user.id,
          email: userEmail || undefined,
          firstName: user.firstName || undefined,
          lastName: user.lastName || undefined,
          role: (user.publicMetadata?.role as string) || 'user',
          name: user.fullName || undefined,
          username: user.username || undefined,
          avatar: user.imageUrl
        };
        console.log("Creating new user:", userData);

         createUser(userData)
          .then((response) => {
            console.log("Response:", response);
            if (response?.token) {
              setToken(response?.token);
            }
            router.push("/");
            console.log("User created successfully");
            toast.success("User created successfully");
            dispatch(fetchUsers()); 
          })
          .catch((error) => {
            console.error('Error creating user:', error);
            // toast.error('Failed to create user');
          });
      } else {
        console.log("User already exists");
      }
    }
  }, [isSignedIn, user, allUsers, dispatch, router]);

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 pb-4 sm:pb-8 mt-16 sm:mt-20 pt-4 bg-white rounded-xl">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
        {/* Main Content */}
        <div className="flex-1 space-y-4 sm:space-y-6">
          {/* Header */}
          <h1 className="text-xl sm:text-2xl font-bold px-2 sm:px-0">Challenges</h1>

          {/* Topics */}
          <div className="flex justify-between items-center gap-2 sm:gap-4 w-full">
            <div className="flex-1 overflow-x-auto max-w-[calc(100vw-100px)] sm:max-w-4xl scrollbar-hide">
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="bg-transparent inline-flex gap-2 justify-start px-2 sm:px-0">
                  <AnimatePresence mode="wait">
                    {topics.map((topic) => {
                      const Icon = topic.icon;
                      return (
                        <motion.div
                          key={topic.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.2 }}
                        >
                          <TabsTrigger
                            value={topic.id}
                            className="flex items-center gap-2 px-4 py-2 rounded-full data-[state=active]:bg-black bg-gray-100 data-[state=active]:text-white min-w-fit group"
                          >
                            <Icon
                              className="w-4 h-4 shrink-0 group-data-[state=active]:!text-white transition-colors"
                              style={{ color: topic.color }}
                            />
                            <span>{topic.label}</span>
                          </TabsTrigger>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </TabsList>
              </Tabs>
            </div>
            <motion.button
              onClick={() => setShowMore(!showMore)}
              className="flex items-center gap-1 px-2 sm:px-3 py-2 text-sm text-gray-600 hover:text-purple whitespace-nowrap shrink-0 font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaAngleDoubleRight
                className={`transition-transform duration-200 ${showMore ? 'rotate-180' : ''}`}
              />
            </motion.button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 px-2 sm:px-0">
            <div className="w-full sm:flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search questions"
                className="pl-9 bg-[#F8F9FA] border-0 w-full"
              />
            </div>
            <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full sm:w-auto">
              <button className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-[#F8F9FA] text-sm font-medium whitespace-nowrap">
                Lists
              </button>
              <button className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-[#F8F9FA] text-sm font-medium whitespace-nowrap">
                Difficulty
              </button>
              <button className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-[#F8F9FA] text-sm font-medium whitespace-nowrap">
                Status
              </button>
              <button className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-[#F8F9FA] text-sm font-medium whitespace-nowrap">
                Tags
              </button>
              <button className="flex-1 sm:flex-none p-2 rounded-lg bg-[#F8F9FA]">
                <Settings2 className="w-5 h-5 mx-auto" />
              </button>
            </div>
          </div>

          {/* Challenge List */}
          <div className="px-2 sm:px-0">
            <ChallengeList />
          </div>
        </div>

        {/* Sidebar - Hidden on mobile */}
        <div className="hidden xl:block w-full xl:w-auto">
          <Sidebar />
        </div>
      </div>
    </div>
  );
};

export default Challenges;