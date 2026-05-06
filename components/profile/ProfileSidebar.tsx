"use client";

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

type Difficulty = "easy" | "medium" | "hard";

const difficultyMeta: Record<Difficulty, { label: string; dot: string; text: string; border: string; bg: string }> = {
  easy:   { label: "Easy",   dot: "bg-neon",   text: "text-neon",   border: "border-neon/30",   bg: "bg-neon/5" },
  medium: { label: "Medium", dot: "bg-warn",   text: "text-warn",   border: "border-warn/30",   bg: "bg-warn/5" },
  hard:   { label: "Hard",   dot: "bg-danger", text: "text-danger", border: "border-danger/30", bg: "bg-danger/5" },
};

const ProfileSidebar = ({ organizedData, UserName, Useravatar }: { organizedData: any, UserName?: any, Useravatar?: any }) => {
  const name = UserName || 'User';
  const avatar = Useravatar || 'https://github.com/shadcn.png';

  const [showAll, setShowAll] = useState({
    easy: false,
    medium: false,
    hard: false,
  });

  const toggleShowAll = (difficulty: Difficulty) => {
    setShowAll((prev) => ({
      ...prev,
      [difficulty]: !prev[difficulty],
    }));
  };

  const getChallengesToShow = (
    challenges: any[],
    difficulty: Difficulty
  ) => {
    if (!challenges) return [];
    return showAll[difficulty] ? challenges : challenges.slice(0, 5);
  };

  const hasMoreChallenges = (challenges: any[]) => {
    return challenges && challenges.length > 5;
  };

  const renderDifficultyGroup = (difficulty: Difficulty, list: any[]) => {
    if (!list || list.length === 0) return null;
    const meta = difficultyMeta[difficulty];
    return (
      <div className={`rounded-md border ${meta.border} ${meta.bg} p-4`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={`block w-2 h-2 rounded-full ${meta.dot}`} />
            <h4 className={`text-[11px] font-mono font-semibold uppercase tracking-widest ${meta.text}`}>
              {meta.label}
            </h4>
          </div>
          <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-semibold uppercase tracking-widest border ${meta.border} ${meta.text} bg-htb-bg/40`}>
            {list.length}
          </span>
        </div>
        <div className="space-y-1.5">
          {getChallengesToShow(list, difficulty).map((submission: any) => (
            <div
              key={submission._id}
              className="flex items-center justify-between text-sm bg-htb-panel border border-htb-border rounded p-2 hover:border-neon/30 transition-colors"
            >
              <span className="truncate text-htb-text text-xs">
                {submission.challenge?.title}
              </span>
              <span className="ml-2 shrink-0 text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-htb-panel-2 text-htb-muted">
                {submission.language}
              </span>
            </div>
          ))}
        </div>
        {hasMoreChallenges(list) && (
          <button
            onClick={() => toggleShowAll(difficulty)}
            className={`flex items-center gap-1 text-[10px] font-mono uppercase tracking-widest font-semibold mt-2 ${meta.text} hover:opacity-80`}
          >
            {showAll[difficulty] ? (
              <>
                <ChevronUp className="w-3 h-3" />
                Show less
              </>
            ) : (
              <>
                <ChevronDown className="w-3 h-3" />
                Show more ({list.length - 5} more)
              </>
            )}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="panel p-5 sm:p-6 space-y-7">
      {/* Profile Header */}
      <div className="text-center">
        <Link href="/profile">
          <div className="relative w-20 h-20 mx-auto mb-4 group cursor-pointer">
            <div className="absolute inset-0 rounded-full p-0.5 bg-gradient-to-r from-neon to-purple-500 group-hover:p-1 transition-all duration-300">
              <div className="w-full h-full rounded-full p-0.5 bg-htb-bg">
                <Image
                  src={avatar}
                  alt="Profile"
                  fill
                  className="rounded-full object-cover"
                  priority
                />
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-neon border-2 border-htb-panel rounded-full flex items-center justify-center shadow-neon-sm">
              <div className="w-1.5 h-1.5 bg-htb-bg rounded-full"></div>
            </div>
          </div>
        </Link>
        <Link href="/profile">
          <h2 className="text-xl font-bold text-htb-text hover:text-neon transition-colors">
            {name}
          </h2>
        </Link>
        <span className="terminal-eyebrow inline-flex mt-1">operator.online</span>
      </div>

      {/* Community Stats */}
      <div className="rounded-md border border-htb-border bg-htb-bg/40 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Trophy className="w-4 h-4 text-neon" />
          <h3 className="text-[11px] font-mono uppercase tracking-widest font-semibold text-htb-text">
            Community Stats
          </h3>
        </div>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-neon" />
              <span className="text-sm text-htb-muted">Solutions</span>
            </div>
            <span className="font-mono text-sm font-semibold text-htb-text tabular-nums">
              {organizedData?.total || 0}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-3.5 h-3.5 text-warn" />
              <span className="text-sm text-htb-muted">Reputation</span>
            </div>
            <span className="font-mono text-sm font-semibold text-htb-text tabular-nums">
              {organizedData?.total || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Languages */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Code className="w-4 h-4 text-neon" />
          <h3 className="text-[11px] font-mono uppercase tracking-widest font-semibold text-htb-text">
            Programming Languages
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {languages.map((lang) => (
            <span
              key={lang}
              className="px-2.5 py-1 rounded border border-neon/30 bg-neon/10 font-mono text-[11px] uppercase tracking-wider text-neon hover:bg-neon/15 transition-colors cursor-pointer"
            >
              {lang}
            </span>
          ))}
        </div>
      </div>

      {/* Challenges Solved */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-4 h-4 text-neon" />
          <h3 className="text-[11px] font-mono uppercase tracking-widest font-semibold text-htb-text">
            Challenges Solved
          </h3>
        </div>

        <div className="space-y-3">
          {organizedData ? (
            <>
              {renderDifficultyGroup("easy", organizedData.easy)}
              {renderDifficultyGroup("medium", organizedData.medium)}
              {renderDifficultyGroup("hard", organizedData.hard)}
              {(!organizedData.easy?.length && !organizedData.medium?.length && !organizedData.hard?.length) && (
                <p className="text-sm text-htb-text-dim text-center py-4 font-mono">
                  No challenges solved yet
                </p>
              )}
            </>
          ) : (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-htb-panel-2 rounded animate-pulse" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;
