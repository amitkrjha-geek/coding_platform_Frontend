"use client";

import Image from "next/image";
import Link from "next/link";

const languages = ["C++", "Java", "Python"];
const skills = {
  Advanced: [
    { name: "Backtracking", count: 10 },
    { name: "Dynamic Programming", count: 2 },
    { name: "Monotonic Stack", count: 2 },
  ],
  Intermediate: [
    { name: "Hash Table", count: 6 },
    { name: "Binary Search", count: 6 },
    { name: "Bit Manipulation", count: 6 },
  ],
  Fundamental: [
    { name: "Array", count: 23 },
    { name: "Two Pointers", count: 9 },
    { name: "Linked List", count: 6 },
  ],
};

const ProfileSidebar = () => {
  return (
    <div className="space-y-8 md:space-y-0 lg:space-y-8 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-6 lg:block">
      {/* Profile Info */}
      <div className="text-center md:col-span-2 lg:col-auto">
        <Link href="/profile">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <Image
              src="https://github.com/shadcn.png"
              alt="Profile"
              fill
              className="rounded-full object-cover hover:opacity-90 transition-opacity"
              priority
            />
          </div>
        </Link>
        <Link href="/profile">
          <h2 className="text-lg font-medium hover:text-purple transition-colors">
            user804950
          </h2>
        </Link>
        <p className="text-sm text-gray-500">@user804950</p>
        <p className="text-sm text-gray-500">Rank 2,248,826</p>
        <button className="mt-4 w-full py-2 rounded-lg bg-[#F8F5FF] text-purple hover:bg-purple hover:text-white transition-colors">
          Edit Profile
        </button>
      </div>

      {/* DPS */}
      <div className="md:col-span-2 lg:col-auto">
        <span className="text-sm text-gray-500">DPS</span>
      </div>

      {/* Community Stats */}
      <div className="md:col-span-1 lg:col-auto">
        <h3 className="font-medium mb-4">Community Stats</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Views</span>
            <span className="text-gray-500">0</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Solution</span>
            <span className="text-gray-500">0</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Discuss</span>
            <span className="text-gray-500">0</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Reputation</span>
            <span className="text-gray-500">0</span>
          </div>
        </div>
      </div>

      {/* Languages */}
      <div className="md:col-span-1 lg:col-auto">
        <h3 className="font-medium mb-4">Languages</h3>
        <div className="flex flex-wrap gap-2">
          {languages.map((lang) => (
            <span
              key={lang}
              className="px-3 py-1 rounded-full bg-[#F8F5FF] text-sm text-purple"
            >
              {lang}
            </span>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div className="md:col-span-2 lg:col-auto">
        <h3 className="font-medium mb-4">Skills</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
          {Object.entries(skills).map(([level, items]) => (
            <div key={level} className="space-y-2">
              <h4 className="text-sm text-red-500 mb-2">• {level}</h4>
              <div className="space-y-2">
                {items.map((skill) => (
                  <div key={skill.name} className="flex justify-between text-sm">
                    <span>{skill.name}</span>
                    <span className="text-gray-500">×{skill.count}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button className="text-purple text-sm hover:underline mt-4">
          Show more
        </button>
      </div>
    </div>
  );
};

export default ProfileSidebar;