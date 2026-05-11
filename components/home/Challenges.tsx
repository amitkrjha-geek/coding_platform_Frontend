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
import GridBackground from "@/components/shared/GridBackground";
import TerminalEyebrow from "@/components/shared/TerminalEyebrow";
import StatCounter from "@/components/shared/StatCounter";
import { useUser } from "@clerk/nextjs";
import { createUser, loginUser } from "@/API/user";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { fetchUsers } from "@/redux/features/userSlice";
import { getToken, setCurrentUserId, setToken } from "@/config/token";
import {
  fetchChallenges,
  getCompanyStats,
  getTopicStats,
} from "@/redux/features/challengeSlice";

const useDynamicTopics = (
  topicStats: { [key: string]: number },
  showMore: boolean,
) => {
  // Convert topic stats to array and sort by count
  const sortedTopics = Object.entries(topicStats)
    .map(([name, count]) => ({
      id: name.trim().toLowerCase(),
      label: `${name.trim()} (${count})`,
      count: count,
    }))
    .sort((a, b) => b.count - a.count);

  // Always include "All Topics" at the start
  const allTopics = [
    {
      id: "all",
      label: "All Topics",
      count: sortedTopics.reduce((acc, topic) => acc + topic.count, 0),
    },
    ...sortedTopics,
  ];

  // Show first 6 topics or all topics based on showMore
  return showMore ? allTopics : allTopics.slice(0, 8);
};

const Challenges = () => {
  const [showMore, setShowMore] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState({
    difficulty: "",
    status: "",
    topics: "",
  });
  const [searchQuery, setSearchQuery] = useState("");

  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const token = getToken();

  const { users: allUsers, status } = useAppSelector(
    (state: RootState) => state.user,
  );

  const {
    status: challengesStatus,
    challenges,
    topicStats,
    loading,
    error,
  } = useAppSelector((state) => state.challenge);
  // console.log({challenges});

  const topics = useDynamicTopics(topicStats || {}, showMore);

  // Filter challenges based on all criteria
  const filteredChallenges = useMemo(() => {
    if (!challenges) return [];

    return challenges.filter((challenge) => {
      // Search filter
      const searchMatch =
        !searchQuery ||
        challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        challenge.topic.some((t) =>
          t.trim().toLowerCase().includes(searchQuery.toLowerCase()),
        ) ||
        challenge.companies.some((c) =>
          c.toLowerCase().includes(searchQuery.toLowerCase()),
        );

      // Difficulty filter
      const difficultyMatch =
        !selectedFilters.difficulty ||
        challenge.difficulty.toLowerCase() ===
          selectedFilters.difficulty.toLowerCase();

      // Status filter
      const statusMatch =
        !selectedFilters.status ||
        challenge.status.toLowerCase() === selectedFilters.status.toLowerCase();

      // Topic filter
      const topicMatch =
        !selectedFilters.topics ||
        challenge.topic.some(
          (t) => t.trim().toLowerCase() === selectedFilters.topics,
        );

      // Company filter
      const companyMatch =
        !selectedCompany ||
        challenge.companies.some((c) => c.toLowerCase() === selectedCompany);

      return (
        searchMatch &&
        difficultyMatch &&
        statusMatch &&
        topicMatch &&
        companyMatch
      );
    });
  }, [challenges, searchQuery, selectedFilters, selectedCompany]);

  const filterOptions = useMemo(
    () => ({
      difficulty: [
        { value: "all", label: "All Difficulties" },
        { value: "easy", label: "Easy" },
        { value: "medium", label: "Medium" },
        { value: "hard", label: "Hard" },
      ],
      status: [
        { value: "all", label: "All Status" },
        { value: "solved", label: "Solved" },
        { value: "unsolved", label: "Unsolved" },
        { value: "attempted", label: "Attempted" },
      ],
      topics: [
        { value: "all", label: "All Topics" },
        ...Object.entries(topicStats || {}).map(([name, count]) => ({
          value: name.trim().toLowerCase(),
          label: `${name.trim()} (${count})`,
        })),
      ].sort((a, b) => {
        if (a.value === "all") return -1;
        if (b.value === "all") return 1;
        return a.label.localeCompare(b.label);
      }),
    }),
    [topicStats],
  );

  const handleFilterChange = (
    type: keyof typeof selectedFilters,
    value: string | null,
  ) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [type]: value === "all" ? "" : value || "",
    }));
  };

  useEffect(() => {
    if (challengesStatus === "idle") {
      dispatch(fetchChallenges());
      dispatch(getCompanyStats());
      dispatch(getTopicStats());
    }
  }, [dispatch, challengesStatus]);

  useEffect(() => {
    if (challengesStatus === "idle") {
      dispatch(fetchChallenges());
      dispatch(getCompanyStats());
      dispatch(getTopicStats());
    }
  }, [dispatch, challengesStatus]);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchUsers());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (isSignedIn && user) {
      const userEmail = user.primaryEmailAddress?.emailAddress;
      // console.log("userEmail",userEmail);
      // console.log("allUsers",allUsers);

      const userExists = allUsers.some(
        (existingUser) => existingUser.email === userEmail,
      );

      if (!userExists) {
        const userData = {
          clerkId: user.id,
          email: userEmail || undefined,
          firstName: user.firstName || "First",
          lastName: user.lastName || "last",
          role: (user.publicMetadata?.role as string) || "user",
          name: user.fullName || userEmail || "User",
          username: user.username || "User",
          avatar: user.imageUrl,
        };
        // console.log("Creating new user:", userData);

        createUser(userData)
          .then((response) => {
            // console.log("Response:", response);
            if (response?.token) {
              setToken(response?.token);
              setCurrentUserId(response?.user?._id);
            }
            router.push("/");
            // console.log("User created successfully");
            toast.success("User created successfully");
            dispatch(fetchUsers());
          })
          .catch((error) => {
            console.error("Error creating user:", error);
            // toast.error('Failed to create user');
          });
      } else if (userExists && !token) {
        loginUser(userEmail || "")
          .then((response) => {
            // console.log("Response:", response);
            if (response?.token) {
              setToken(response?.token);
              setCurrentUserId(response?.user?._id);
            }
          })
          .catch((error) => {
            console.error("Error creating user:", error);
            toast.error("Failed to create user");
          });
        // console.log("User already exists");
      } else if (userExists) {
        loginUser(userEmail || "")
          .then((response) => {
            // console.log("Response:", response);
            if (response?.token) {
              setToken(response?.token);
              setCurrentUserId(response?.user?._id);
            }
          })
          .catch((error) => {
            console.error("Error creating user:", error);
            toast.error("Failed to create user");
          });
        // console.log("User already exists");
      }
    }
  }, [isSignedIn, user, allUsers, dispatch, router, token]);

  // Aggregate stats for hero counters (visual only — sourced from existing Redux state)
  const totalChallenges = challenges?.length || 0;
  const totalTopics = Object.keys(topicStats || {}).length;
  const totalSubmissions = useMemo(
    () =>
      (challenges || []).reduce(
        (acc, c) => acc + (Number(c.submissions) || 0),
        0,
      ),
    [challenges],
  );

  return (
    <div className="relative w-full pt-16">
      {/* Hero band */}
      <section className="relative overflow-hidden border-b border-htb-border">
        <GridBackground variant="neon" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-8 sm:pb-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-3"
          >
            <TerminalEyebrow cursor>challenges.index</TerminalEyebrow>
            <h1 className="heading-display text-3xl sm:text-4xl lg:text-5xl text-htb-text">
              Hack your way through{" "}
              <span className="text-neon">real-world</span> challenges
            </h1>
            <p className="text-htb-muted max-w-2xl text-sm sm:text-base">
              Sharpen your offensive engineering skills on a curated arsenal of
              hands-on labs. Compile, exploit, and capture the flag.
            </p>
          </motion.div>

          {/* Stat strip */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-8 grid grid-cols-3 gap-3 sm:gap-6 max-w-2xl"
          >
            <div className="panel p-4 sm:p-5">
              <StatCounter value={totalChallenges} label="Challenges" />
            </div>
            <div className="panel p-4 sm:p-5">
              <StatCounter value={totalTopics} label="Topics" />
            </div>
            <div className="panel p-4 sm:p-5">
              <StatCounter value={totalSubmissions} label="Submissions" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main content */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
              <TerminalEyebrow>filter.topics</TerminalEyebrow>
              {!loading && Object.keys(topicStats || {}).length > 7 && (
                <motion.button
                  onClick={() => setShowMore(!showMore)}
                  className="flex items-center gap-2 px-3 py-1.5 text-[11px] font-mono uppercase tracking-widest text-htb-muted hover:text-neon whitespace-nowrap shrink-0 border border-htb-border rounded hover:border-neon/40 transition-colors"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {showMore ? "Less" : "More"}
                  <FaAngleDoubleRight
                    className={`transition-transform duration-200 ${showMore ? "rotate-180" : ""}`}
                  />
                </motion.button>
              )}
            </div>

            {/* Topics */}
            <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
              <Tabs
                defaultValue="all"
                className="w-full"
                onValueChange={(value) => {
                  setSelectedFilters((prev) => ({
                    ...prev,
                    topics: value === "all" ? "" : value,
                  }));
                }}
                value={selectedFilters.topics || "all"}
              >
                <TabsList className="bg-transparent border-0 inline-flex gap-2 justify-start p-0">
                  <AnimatePresence mode="wait">
                    {loading ? (
                      <>
                        {[...Array(6)].map((_, index) => (
                          <motion.div
                            key={`skeleton-${index}`}
                            className="h-9 w-24 bg-htb-panel border border-htb-border animate-pulse rounded-md"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          />
                        ))}
                      </>
                    ) : topics.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-htb-text-dim font-mono text-xs px-4 py-2"
                      >
                        No topics available
                      </motion.div>
                    ) : (
                      topics.map((topic) => (
                        <motion.div
                          key={topic.id}
                          initial={{ opacity: 0, x: 12 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -12 }}
                          transition={{ duration: 0.2 }}
                        >
                          <TabsTrigger
                            value={topic.id}
                            className="px-3.5 py-1.5 rounded-md font-mono text-[11px] uppercase tracking-widest border border-htb-border bg-htb-panel text-htb-muted hover:text-htb-text hover:border-htb-border-hover data-[state=active]:bg-neon/10 data-[state=active]:text-neon data-[state=active]:border-neon/40 data-[state=active]:shadow-neon-sm min-w-fit transition-all"
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

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="w-full sm:flex-1 relative">
                <Search
                  className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${
                    loading
                      ? "text-htb-text-dim animate-pulse"
                      : "text-htb-text-dim"
                  }`}
                />
                <Input
                  placeholder={
                    loading
                      ? "LOADING..."
                      : "Search challenges, topics, companies..."
                  }
                  className="pl-9 w-full font-mono text-sm"
                  disabled={loading}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {error && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-danger text-xs font-mono uppercase tracking-wider">
                    Error
                  </div>
                )}
              </div>
              <div className="grid grid-cols-3 sm:flex flex-wrap sm:flex-nowrap gap-2 w-full sm:w-auto">
                {Object.entries(filterOptions).map(([key, options]) => (
                  <Select
                    key={key}
                    value={selectedFilters[key as keyof typeof selectedFilters]}
                    onValueChange={(value) =>
                      handleFilterChange(
                        key as keyof typeof selectedFilters,
                        value,
                      )
                    }
                  >
                    <SelectTrigger
                      className="w-full sm:w-[140px] font-mono text-xs uppercase tracking-wider"
                      onClick={() => {
                        if (
                          selectedFilters[key as keyof typeof selectedFilters]
                        ) {
                          handleFilterChange(
                            key as keyof typeof selectedFilters,
                            null,
                          );
                        }
                      }}
                    >
                      <SelectValue
                        placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                      />
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

            {/* Result count */}
            {!loading && (
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-htb-text-dim">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-neon shadow-neon-sm" />
                <span>
                  <span className="text-htb-text">
                    {filteredChallenges.length}
                  </span>{" "}
                  result{filteredChallenges.length === 1 ? "" : "s"}
                </span>
              </div>
            )}

            {/* Challenge List */}
            <div>
              <ChallengeList
                challenges={filteredChallenges}
                loading={loading}
              />
            </div>
          </div>

          {/* Sidebar - reserved (kept commented as before) */}
          {/* <div className="hidden xl:block w-full xl:w-auto">
            <Sidebar
              selectedCompany={selectedCompany}
              onCompanySelect={setSelectedCompany}
            />
          </div> */}
        </div>
      </section>
    </div>
  );
};

export default Challenges;
