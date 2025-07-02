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


interface CodeTemplates {
  c: string;
  cpp: string;
  csharp: string;
}


export const generateCodeTemplate = (): CodeTemplates => {
  const templates: CodeTemplates = {
    c: `#include <stdio.h>
#include <stdlib.h>

int main() {
    // Write your C code here
    // Read input from stdin (scanf, gets)
    // Print output to stdout (printf)
    
    return 0;
}`,

    cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    // Write your C++ code here
    // cin for input, cout for output
    // Use STL containers like vector, set, map
    
    return 0;
}`,

    csharp: `using System;
using System.Collections.Generic;

public class Solution {
    public static void Main(string[] args) {
        // Write your C# code here
        // Console.ReadLine() for input
        // Console.WriteLine() for output
        
    }
}`
  };

  return templates;
};