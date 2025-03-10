"use client";

import { useMemo } from 'react';
import ChallengeCard from "./ChallengeCard";
import { v4 as uuid } from 'uuid'

const challenges = Array(8).fill({
  id: "3151",
  title: "Special Array I",
  difficulty: "Easy",
  submissions: "558.9K",
  acceptanceRate: "53.8%",
});

const ChallengeList = () => {
  const memoizedChallenges = useMemo(() => challenges, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {memoizedChallenges.map((challenge) => (
        <ChallengeCard
          key={uuid()}
          id={uuid()}
          title={`${challenge.title}`}
          difficulty={challenge.difficulty}
          submissions={challenge.submissions}
          acceptanceRate={challenge.acceptanceRate}
        />
      ))}
    </div>
  );
};

export default ChallengeList;