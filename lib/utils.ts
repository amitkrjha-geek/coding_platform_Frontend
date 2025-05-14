import { User } from "@/types";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}




export const formatUserData = (data: User[]): {
  id: string;
  name: string;
  country: string;
  joinDate: string;
  subscription: string;
  avatar: string;
  role: string;
}[] => {
  return data?.map((user) => ({
    id: user._id,
    name: user?.name ?? 'N/A',
    country: user?.address?.country ?? 'N/A',
    joinDate: user?.createdAt ?? new Date().toISOString(),
    subscription: user.subscription,
    avatar: user.avatar ?? '/default-avatar.png',
    role: user.role,
  }));
};


interface QuestionData {
  id: string;
  title: string;
  difficulty: string;
  problemStatement?: string;
  description?: string;
  examples: {
      input: string;
      output: string;
      explanation?: string;
  }[];
  constraints: string[];
}

interface CodeTemplates {
  c: string;
  cpp: string;
  csharp: string;
}

// Helper functions to generate function signatures based on input/output types
const getFunctionSignatureC = (questionData: QuestionData): string => {
  const example = questionData.examples[0];
  if (example.input.includes('grid')) {
      return 'int largestIsland(int** grid, int gridSize, int* gridColSize) {';
  }
  // Add more conditions for different input types
  return 'int solve() {';
};

const getFunctionSignatureCpp = (questionData: QuestionData): string => {
  const example = questionData.examples[0];
  if (example.input.includes('grid')) {
      return 'int largestIsland(vector<vector<int>>& grid) {';
  }
  return 'int solve() {';
};

const getFunctionSignatureCSharp = (questionData: QuestionData): string => {
  const example = questionData.examples[0];
  if (example.input.includes('grid')) {
      return 'public int LargestIsland(int[][] grid) {';
  }
  return 'public int Solve() {';
};

export const generateCodeTemplate = (questionData: QuestionData): CodeTemplates => {
  const functionName = questionData.title
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '');

  const templates: CodeTemplates = {
      c: `#include <stdio.h>
#include <stdlib.h>

// ${questionData.description}

// Constraints:
${questionData.constraints.map(c => `// ${c}`).join('\n')}

${getFunctionSignatureC(questionData)}
    // Write your solution here
    
    return 0;
}`,

      cpp: `#include <iostream>
#include <vector>
using namespace std;

// ${questionData.description}

// Constraints:
${questionData.constraints.map(c => `// ${c}`).join('\n')}

class Solution {
public:
    ${getFunctionSignatureCpp(questionData)}
        // Write your solution here
        
        return 0;
    }
};`,

      csharp: `using System;
using System.Collections.Generic;

// ${questionData.description}

// Constraints:
${questionData.constraints.map(c => `// ${c}`).join('\n')}

public class Solution {
    ${getFunctionSignatureCSharp(questionData)}
        // Write your solution here
        
        return 0;
    }
}`
  };

  return templates;
};