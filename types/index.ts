export interface Example {
    input: string
    output: string
    explanation: string
}

export interface Question {
    id: string
    title: string
    difficulty: 'Easy' | 'Medium' | 'Hard'
    description: string
    examples: Example[]
    constraints: string[]
}

export interface Language {
    id: string;
    name: string;
    template: string;
}

export type LogEntry = {
    timestamp: string
    method: string
    path: string
    status: string
    message: string
}

export interface SubmissionDetailProps {
    id: string
    status: "Accepted" | "Wrong Answer" | "Time Limit Exceeded" | "Runtime Error"
    testcasesPassed: number
    totalTestcases: number
    timestamp: string
    runtime: {
        value: number
        beats: number
    }
    memory: {
        value: number
        beats: number
    }
    language: string
    code: string
}


export interface MetricCardProps {
    title: string;
    value:  string;
    icon: React.ReactNode;
    link?: string;
  }


  export interface AdminType {
    id: string;
    name: string;
    joinDate: string;
    role: string;
    avatar: string;
  }

  export interface UserType {
    id: string;
    name: string;
    country: string;
    joinDate: string;
    subscription: string;
    avatar: string;
  }

  interface Address {
    addressLine?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
  }

  export interface User {
    _id: string;
    name: string;
    clerkId?: string;
    firstName?: string;
    lastName?: string;
    username?: string;
    email: string;
    password?: string;
    mobileNo?: string;
    role: 'admin' | 'user';
    address?: Address;
    assignedRole?: string;
    adminRights: string[];
    subscription: 'Free' | 'Plan A' | 'Plan B' | 'Plan C';
    avatar?: string;
    createdAt: string;
    updatedAt: string;
    __v?: number;
  }

  

  export interface Topic {
    id: number;
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    submissions: number;
    acceptanceRate: number;
  }
  
  export interface TrendingCompany {
    name: string;
    count: number;
  }


  export type Transaction = {
    paymentId: string;
    paidBy: string;
    dateTime: string;
    modeOfPayment: string;
    amount: number;
    currency: string;
    coupon: string;
    plan: string;
  };