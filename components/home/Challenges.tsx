"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { FaAngleDoubleRight } from "react-icons/fa";
import ChallengeList from "./ChallengeList";
import Sidebar from "./Sidebar";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { createUser, loginUser } from "@/API/user";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { fetchUsers } from "@/redux/features/userSlice";
import { getToken, setToken } from "@/config/token";
import { fetchChallenges, getCompanyStats, getTopicStats } from "@/redux/features/challengeSlice";

const useDynamicTopics = (topicStats: { [key: string]: number }, showMore: boolean) => {
  // Convert topic stats to array and sort by count
  const sortedTopics = Object.entries(topicStats)
    .map(([name, count]) => ({
      id: name.trim().toLowerCase(),
      label: `${name.trim()} (${count})`,
      count: count
    }))
    .sort((a, b) => b.count - a.count);

  // Always include "All Topics" at the start
  const allTopics = [{
    id: "all",
    label: "All Topics",
    count: sortedTopics.reduce((acc, topic) => acc + topic.count, 0)
  }, ...sortedTopics];

  // Show first 6 topics or all topics based on showMore
  return showMore ? allTopics : allTopics.slice(0, 8);
};

const Challenges = () => {

  const [showMore, setShowMore] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState({
    difficulty: "",
    status: "",
    topics: ""
  });
  const [searchQuery, setSearchQuery] = useState("");

  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const token = getToken();

  const { users: allUsers, status } = useAppSelector(
    (state: RootState) => state.user
  );

  const { status: challengesStatus, challenges, topicStats, loading, error } = useAppSelector((state) => state.challenge);

  const topics = useDynamicTopics(topicStats || {}, showMore);

  // Filter challenges based on all criteria
  const filteredChallenges = useMemo(() => {
    if (!challenges) return [];

    return challenges.filter(challenge => {
      // Search filter
      const searchMatch = !searchQuery ||
        challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        challenge.topic.some(t => t.trim().toLowerCase().includes(searchQuery.toLowerCase())) ||
        challenge.companies.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));

      // Difficulty filter
      const difficultyMatch = !selectedFilters.difficulty ||
        challenge.difficulty.toLowerCase() === selectedFilters.difficulty.toLowerCase();

      // Status filter
      const statusMatch = !selectedFilters.status ||
        challenge.status.toLowerCase() === selectedFilters.status.toLowerCase();

      // Topic filter
      const topicMatch = !selectedFilters.topics ||
        challenge.topic.some(t => t.trim().toLowerCase() === selectedFilters.topics);

      // Company filter
      const companyMatch = !selectedCompany ||
        challenge.companies.some(c => c.toLowerCase() === selectedCompany);

      return searchMatch && difficultyMatch && statusMatch && topicMatch && companyMatch;
    });
  }, [challenges, searchQuery, selectedFilters, selectedCompany]);

  const filterOptions = useMemo(() => ({
    difficulty: [
      { value: "all", label: "All Difficulties" },
      { value: "easy", label: "Easy" },
      { value: "medium", label: "Medium" },
      { value: "hard", label: "Hard" }
    ],
    status: [
      { value: "all", label: "All Status" },
      { value: "solved", label: "Solved" },
      { value: "unsolved", label: "Unsolved" },
      { value: "attempted", label: "Attempted" }
    ],
    topics: [
      { value: "all", label: "All Topics" },
      ...Object.entries(topicStats || {}).map(([name, count]) => ({
        value: name.trim().toLowerCase(),
        label: `${name.trim()} (${count})`
      }))
    ].sort((a, b) => {
      if (a.value === "all") return -1;
      if (b.value === "all") return 1;
      return a.label.localeCompare(b.label);
    })
  }), [topicStats]);

  const handleFilterChange = (type: keyof typeof selectedFilters, value: string | null) => {
    setSelectedFilters(prev => ({
      ...prev,
      [type]: value === "all" ? "" : value || ""
    }));
  };

  useEffect(() => {
    if (challengesStatus === 'idle') {
      dispatch(fetchChallenges());
      dispatch(getCompanyStats());
      dispatch(getTopicStats());
    }
  }, [dispatch, challengesStatus]);

  useEffect(() => {
    if (challengesStatus === 'idle') {
      dispatch(fetchChallenges());
      dispatch(getCompanyStats());
      dispatch(getTopicStats());
    }
  }, [dispatch, challengesStatus]);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUsers());
    }
  }, [dispatch, status]);


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
      } else if (userExists && !token) {

        loginUser(userEmail || '')
          .then((response) => {
            console.log("Response:", response);
            if (response?.token) {
              setToken(response?.token);
            }
          })
          .catch((error) => {
            console.error('Error creating user:', error);
            toast.error('Failed to create user');
          });
        console.log("User already exists");
      }
    }
  }, [isSignedIn, user, allUsers, dispatch, router, token]);

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
              <Tabs
                defaultValue="all"
                className="w-full"
                onValueChange={(value) => {
                  setSelectedFilters(prev => ({
                    ...prev,
                    topics: value === "all" ? "" : value
                  }));
                }}
                value={selectedFilters.topics || "all"}
              >
                <TabsList className="bg-transparent inline-flex gap-2 justify-start px-2 sm:px-0">
                  <AnimatePresence mode="wait">
                    {loading ? (
                      // Loading skeleton for topics
                      <>
                        {[...Array(6)].map((_, index) => (
                          <motion.div
                            key={`skeleton-${index}`}
                            className="h-10 w-24 bg-gray-200 animate-pulse rounded-full"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          />
                        ))}
                      </>
                    ) : topics.length === 0 ? (
                      // No topics found state
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-gray-500 px-4 py-2"
                      >
                        No topics available
                      </motion.div>
                    ) : (
                      // Render actual topics
                      topics.map((topic) => (
                        <motion.div
                          key={topic.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.2 }}
                        >
                          <TabsTrigger
                            value={topic.id}
                            className="px-4 py-2 rounded-full data-[state=active]:bg-black bg-gray-100 data-[state=active]:text-white min-w-fit"
                          >
                            <span>{topic.label}</span>
                          </TabsTrigger>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </TabsList>
              </Tabs>
            </div>
            {!loading && Object.keys(topicStats || {}).length > 7 && (
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
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 px-2 sm:px-0">
            <div className="w-full sm:flex-1 relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${loading ? 'text-gray-300 animate-pulse' : 'text-gray-400'}`} />
              <Input
                placeholder={loading ? "Loading..." : "Search questions"}
                className="pl-9 bg-[#F8F9FA] border-0 w-full"
                disabled={loading}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {error && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 text-sm">
                  Error loading challenges
                </div>
              )}
            </div>
            <div className="grid grid-cols-3 sm:flex flex-wrap sm:flex-nowrap gap-2 w-full sm:w-auto">
              {Object.entries(filterOptions).map(([key, options]) => (
                <Select
                  key={key}
                  value={selectedFilters[key as keyof typeof selectedFilters]}
                  onValueChange={(value) => handleFilterChange(key as keyof typeof selectedFilters, value)}
                >
                  <SelectTrigger
                    className="w-full sm:w-[120px] bg-[#F8F9FA] border-0"
                    onClick={() => {
                      // If there's already a value selected, clear it
                      if (selectedFilters[key as keyof typeof selectedFilters]) {
                        handleFilterChange(key as keyof typeof selectedFilters, null);
                      }
                    }}
                  >
                    <SelectValue placeholder={key.charAt(0).toUpperCase() + key.slice(1)} />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ))}
            </div>
          </div>

          {/* Challenge List */}
          <div className="px-2 sm:px-0">
            <ChallengeList
              challenges={filteredChallenges}
              loading={loading}
            />
          </div>
        </div>

        {/* Sidebar - Hidden on mobile */}
        <div className="hidden xl:block w-full xl:w-auto">
          <Sidebar
            selectedCompany={selectedCompany}
            onCompanySelect={setSelectedCompany}
          />
        </div>
      </div>
    </div>
  );
};

export default Challenges;