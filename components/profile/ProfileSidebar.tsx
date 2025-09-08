"use client";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { 
  Trophy, 
  Code, 
  Star, 

  Target,
  CheckCircle,
  ChevronDown,
  ChevronUp
} from "lucide-react";

const languages = ["C", "C++", "C#"];

const ProfileSidebar = ({ organizedData }: { organizedData: any }) => {
  // console.log({ organizedData });
  const { user } = useUser();
  const name = user?.fullName || 'User';
  const avatar = user?.imageUrl || 'https://github.com/shadcn.png';

  console.log('📊 User:', user);

  const [showAll, setShowAll] = useState({
    easy: false,
    medium: false,
    hard: false,
  });

  const toggleShowAll = (difficulty: "easy" | "medium" | "hard") => {
    setShowAll((prev) => ({
      ...prev,
      [difficulty]: !prev[difficulty],
    }));
  };

  const getChallengesToShow = (
    challenges: any[],
    difficulty: "easy" | "medium" | "hard"
  ) => {
    if (!challenges) return [];
    return showAll[difficulty] ? challenges : challenges.slice(0, 5);
  };

  const hasMoreChallenges = (challenges: any[]) => {
    return challenges && challenges.length > 5;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-8">
      {/* Profile Header */}
      <div className="text-center">
        <Link href="/profile">
          <div className="relative w-20 h-20 mx-auto mb-4 group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full p-0.5 group-hover:p-1 transition-all duration-300">
              <div className="w-full h-full bg-white rounded-full p-0.5">
                <Image
                  src={avatar}
                  alt="Profile"
                  fill
                  className="rounded-full object-cover"
                  priority
                />
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
        </Link>
        <Link href="/profile">
          <h2 className="text-xl font-bold text-gray-900 hover:text-purple-600 transition-colors mb-1">
            {name}
          </h2>
        </Link>
      </div>

      {/* DPS */}
      {/* <div className="md:col-span-2 lg:col-auto">
        <span className="text-sm text-gray-500">DPS</span>
      </div> */}

      {/* Community Stats */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-gray-900">Community Stats</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-gray-700">Solutions</span>
            </div>
            <span className="text-sm font-bold text-gray-900">{organizedData?.total || 0}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700">Reputation</span>
            </div>
            <span className="text-sm font-bold text-gray-900">{organizedData?.total || 0}</span>
          </div>
          {/* <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-700">Rank</span>
            </div>
            <span className="text-sm font-bold text-gray-900">#1,234</span>
          </div> */}
        </div>
      </div>

      {/* Languages */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Code className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-gray-900">Programming Languages</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {languages.map((lang) => (
            <span
              key={lang}
              className="px-3 py-1.5 rounded-lg bg-purple-100 text-sm font-medium text-purple-700 hover:bg-purple-200 transition-colors cursor-pointer"
            >
              {lang}
            </span>
          ))}
        </div>
      </div>

      {/* Challenges Solved */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-gray-900">Challenges Solved</h3>
        </div>

        <div className="space-y-4">
          {organizedData && (
            <>
              {/* Easy Challenges */}
              {organizedData.easy && organizedData.easy.length > 0 && (
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <h4 className="text-sm font-semibold text-green-700">
                        Easy Challenges
                      </h4>
                    </div>
                    <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full font-medium">
                      {organizedData.easy.length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {getChallengesToShow(organizedData.easy, "easy").map(
                      (submission: any) => (
                        <div
                          key={submission._id}
                          className="flex items-center justify-between text-sm bg-white rounded-lg p-2 hover:shadow-sm transition-shadow"
                        >
                          <span className="truncate font-medium text-gray-700">
                            {submission.challenge?.title}
                          </span>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {submission.language}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                  {hasMoreChallenges(organizedData.easy) && (
                    <button
                      onClick={() => toggleShowAll("easy")}
                      className="flex items-center gap-1 text-green-600 text-xs font-medium hover:text-green-700 mt-2"
                    >
                      {showAll.easy ? (
                        <>
                          <ChevronUp className="w-3 h-3" />
                          Show less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3 h-3" />
                          Show more ({organizedData.easy.length - 5} more)
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}

              {/* Medium Challenges */}
              {organizedData.medium && organizedData.medium.length > 0 && (
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <h4 className="text-sm font-semibold text-yellow-700">
                        Medium Challenges
                      </h4>
                    </div>
                    <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full font-medium">
                      {organizedData.medium.length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {getChallengesToShow(organizedData.medium, "medium").map(
                      (submission: any) => (
                        <div
                          key={submission._id}
                          className="flex items-center justify-between text-sm bg-white rounded-lg p-2 hover:shadow-sm transition-shadow"
                        >
                          <span className="truncate font-medium text-gray-700">
                            {submission.challenge?.title}
                          </span>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {submission.language}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                  {hasMoreChallenges(organizedData.medium) && (
                    <button
                      onClick={() => toggleShowAll("medium")}
                      className="flex items-center gap-1 text-yellow-600 text-xs font-medium hover:text-yellow-700 mt-2"
                    >
                      {showAll.medium ? (
                        <>
                          <ChevronUp className="w-3 h-3" />
                          Show less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3 h-3" />
                          Show more ({organizedData.medium.length - 5} more)
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}

              {/* Hard Challenges */}
              {organizedData.hard && organizedData.hard.length > 0 && (
                <div className="bg-red-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <h4 className="text-sm font-semibold text-red-700">
                        Hard Challenges
                      </h4>
                    </div>
                    <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded-full font-medium">
                      {organizedData.hard.length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {getChallengesToShow(organizedData.hard, "hard").map(
                      (submission: any) => (
                        <div
                          key={submission._id}
                          className="flex items-center justify-between text-sm bg-white rounded-lg p-2 hover:shadow-sm transition-shadow"
                        >
                          <span className="truncate font-medium text-gray-700">
                            {submission.challenge?.title}
                          </span>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {submission.language}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                  {hasMoreChallenges(organizedData.hard) && (
                    <button
                      onClick={() => toggleShowAll("hard")}
                      className="flex items-center gap-1 text-red-600 text-xs font-medium hover:text-red-700 mt-2"
                    >
                      {showAll.hard ? (
                        <>
                          <ChevronUp className="w-3 h-3" />
                          Show less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3 h-3" />
                          Show more ({organizedData.hard.length - 5} more)
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;
