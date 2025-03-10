import { FileText } from "lucide-react";

interface ChallengeDetailsProps {
  title: string;
  difficulty: string;
  stats: {
    Accepted: string;
    Submissions: string;
    acceptanceRate: string;
  };
}

const ChallengeDetails = ({ title, difficulty, stats }: ChallengeDetailsProps) => {
  return (
    <div className="prose max-w-none">
      {/* Challenge Title and Difficulty */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm">{difficulty}</span>
      </div>

      {/* Statistics */}
      <div className="flex gap-8 mb-6 text-sm text-gray-600 border-b pb-4">
        <div className="flex items-center gap-2">
          <span>✓ Accepted</span>
          <span className="font-medium">{stats.Accepted}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>✓ Submissions</span>
          <span className="font-medium">{stats.Submissions}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Acceptance Rate:</span>
          <span className="font-medium">{stats.acceptanceRate}</span>
        </div>
      </div>

      <p className="mb-4">
        You are given an n x n binary matrix grid. You are allowed to change at most one 0 to be 1. Return size of the largest island in grid after applying this operation.
      </p>

      {/* Examples */}
      <div className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">Example 1:</h3>
          <div className="bg-gray-50 p-3 rounded">
            <p>Input: grid = [[1,0],[0,1]]</p>
            <p>Output: 3</p>
            <p className="text-gray-600">Explanation: Change one 0 to 1 and connect two 1s, then we get an island with area = 3</p>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Example 2:</h3>
          <div className="bg-gray-50 p-3 rounded">
            <p>Input: grid = [[1,1],[1,0]]</p>
            <p>Output: 4</p>
            <p className="text-gray-600">Explanation: Change the 0 to 1 and make the island bigger, only one island with area = 4</p>
          </div>
        </div>
      </div>

      {/* Constraints */}
      <div className="mt-6">
        <h3 className="font-medium mb-2">Constraints:</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>n == grid.length</li>
          <li>n == grid[i].length</li>
          <li>1 ≤ n ≤ 500</li>
          <li>grid[i][j] is either 0 or 1</li>
        </ul>
      </div>

      {/* Files Section */}
      <div className="mt-6">
        <h3 className="font-medium mb-3">Uploaded Artifacts or Required Files</h3>
        <div className="flex gap-3">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded">
              <FileText className="w-4 h-4 text-red-500" />
              <span>ModifyKey.sln</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChallengeDetails;