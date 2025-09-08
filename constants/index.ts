import { LogEntry, Question, Transaction } from '@/types';
import {  Topic, TrendingCompany } from '@/types';
import { Video, Building2, Terminal, BarChart, Monitor, Zap, FolderKanban, Cloud, Lock, Code2, Gift, BookOpen } from 'lucide-react';

export const testimonials = [
    {
        content: "I gained all my coding skills from LeetCode. After 6 months of dedicated practice, I received multiple job offers. The platform's comprehensive problem set and detailed explanations were instrumental in my success.",
        author: "Yuanwei Zhang",
        role: "Software Engineer",
        companies: ["Facebook", "LinkedIn"],
        achievement: "Secured offers from both companies with competitive packages",
        yearOfSuccess: "2023"
    },
    {
        content: "Coming from a non-CS background, LeetCode was my primary resource for interview preparation. The premium subscription's video explanations and pattern recognition helped me understand complex algorithms. After 4 months of preparation, I landed my dream job.",
        author: "Georg Hempfhocker",
        role: "Senior Software Engineer",
        companies: ["Amazon", "Microsoft"],
        achievement: "Successfully transitioned from finance to tech",
        yearOfSuccess: "2023"
    },
    {
        content: "The mock interviews and real-time coding environment gave me the confidence I needed. The platform's extensive database of problems and detailed solutions helped me master dynamic programming and system design concepts.",
        author: "Sarah Miller",
        role: "Full Stack Developer",
        companies: ["Netflix", "Apple"],
        achievement: "Secured senior position with 50% salary increase",
        yearOfSuccess: "2024"
    }
];

export const plans = [
    {
        name: "Monthly",
        description: "billed monthly",
        price: 999,
        period: "/mo",
        features: ["all premium features"],
        note: "Our monthly plan grants access to",
        subNote: "the best plan for short-term subscribers",
        buttonText: "Subscribe",
        buttonVariant: "secondary",
    },
    {
        name: "Yearly",
        description: "billed yearly ($159)",
        price: 1999,
        period: "/mo",
        features: ["all premium features"],
        note: "Our most popular plan typically sells for $299 and is now",
        subNote: "This plan saves you over 60% in comparison to the monthly plan",
        buttonText: "Subscribe",
        buttonVariant: "primary",
        popular: true,
    }
];

export const features = [
    {
        icon: Video,
        title: "Video Solutions",
        description: "Unlock elaborate premium video solutions like this. Each video includes a detailed conceptual overview and code walkthrough that will efficiently guide you through the problem."
    },
    {
        icon: Building2,
        title: "Select Questions by Company",
        description: "Target your studying more accurately towards reaching your dream job! Find out which companies ask which specific questions. We have nearly 200 questions from Google alone."
    },
    {
        icon: Terminal,
        title: "Debugger",
        description: "Tired of System.out.println()? Set breakpoints and debug code interactively through our code editor."
    },
    {
        icon: BarChart,
        title: "Sort Questions by Prevalence",
        description: "Find out which questions turn up most frequently in interviews so that you know where to focus your personal studying. Invaluable data collected from thousands of samples."
    },
    {
        icon: Monitor,
        title: "Interview Simulations",
        description: "Mock assessments provide you with a way to test your abilities in a timed setting, just like a coding challenge or on-site interview."
    },
    {
        icon: Zap,
        title: "Lightning Judge",
        description: "Tired of waiting? Premium users get priority judging using an exclusive queue, resulting in a 3X shorter wait time, up to 10X during peak hours."
    },
    {
        icon: FolderKanban,
        title: "Unlimited Playgrounds",
        description: "Premium users can create an unlimited number of Playgrounds, up from 10! You also get the ability to organize your Playgrounds in folders."
    },
    {
        icon: Cloud,
        title: "Cloud Storage",
        description: "Code and layouts are instantly saved to the cloud, ensuring you can learn across devices at ease."
    },
    {
        icon: Lock,
        title: "Access to Premium Content",
        description: "Gain exclusive access to our latest and ever-growing collection of premium content, including questions, Explore cards, and detailed explanations."
    },
    {
        icon: Code2,
        title: "Autocomplete",
        description: "Get intelligent code autocompletion based on language context and analysis of your source code."
    },
    {
        icon: Gift,
        title: "Additional Discounts",
        description: "Premium subscription also gets you significant discounts on select items and content."
    },
    {
        icon: BookOpen,
        title: "Study Guides",
        description: "Access comprehensive study guides and learning paths tailored to your skill level and goals."
    }
];

export const logData: LogEntry[] = [
    {
        timestamp: "[11/Dec/2018:11:01:28 -0600]",
        method: "GET",
        path: "/blog/seo/robots-txt-mistakes-best-uses-guide",
        status: "502",
        message: "Streaming From Origin",
    },
    {
        timestamp: "[11/Dec/2018:11:01:28 -0600]",
        method: "GET",
        path: "/wp-content/themes/portent_portent/assets/styles",
        status: "502",
        message: "Streaming From Origin",
    },
    {
        timestamp: "[11/Dec/2018:11:01:28 -0600]",
        method: "GET",
        path: "/blog/internet-marketing/the_internet_marketing",
        status: "502",
        message: "Streaming From Origin",
    },
    {
        timestamp: "[11/Dec/2018:11:01:28 -0600]",
        method: "GET",
        path: "/about/careers",
        status: "502",
        message: "Streaming From Origin",
    },
    {
        timestamp: "[11/Dec/2018:11:01:28 -0600]",
        method: "GET",
        path: "/blog/featured",
        status: "502",
        message: "Streaming From Origin",
    },
    {
        timestamp: "[11/Dec/2018:11:01:28 -0600]",
        method: "GET",
        path: "/services/ppc",
        status: "502",
        message: "Streaming From Origin",
    },
    {
        timestamp: "[11/Dec/2018:11:01:28 -0600]",
        method: "GET",
        path: "/services/amazon",
        status: "502",
        message: "Streaming From Origin",
    },
    {
        timestamp: "[11/Dec/2018:11:01:28 -0600]",
        method: "GET",
        path: "/case-study/expand-audience-reach-content-strategy",
        status: "502",
        message: "Streaming From Origin",
    },
    {
        timestamp: "[11/Dec/2018:11:01:28 -0600]",
        method: "GET",
        path: "/wp-content/themes/portent_portent/assets/scripts",
        status: "502",
        message: "Streaming From Origin",
    },
    {
        timestamp: "[11/Dec/2018:11:01:28 -0600]",
        method: "GET",
        path: "/blog/seo/structure-site-navigation-for-seo",
        status: "502",
        message: "Streaming From Origin",
    },
    {
        timestamp: "[11/Dec/2018:11:01:28 -0600]",
        method: "GET",
        path: "/blog/author/caleb-cosper",
        status: "502",
        message: "Streaming From Origin",
    }
];

      



// export const admins= [
//     {
//       id: 1,
//       name: "Ravi Mishra",
//       joinDate: "2024-01-15",
//       role: "Tech Lead",
//       avatar: "https://github.com/shadcn.png",
//     },
//     {
//       id: 2,
//       name: "Emma Wilson",
//       joinDate: "2024-02-01",
//       role: "QA Engineer",
//       avatar: "https://github.com/shadcn.png",
//     },
//     {
//       id: 3,
//       name: "Liam Chen",
//       joinDate: "2024-02-15",
//       role: "Backend Dev",
//       avatar: "https://github.com/shadcn.png",
//     },
//     {
//       id: 4,
//       name: "Sofia Rodriguez",
//       joinDate: "2024-03-01",
//       role: "Backend Dev",
//       avatar: "https://github.com/shadcn.png",
//     },
//     {
//       id: 5,
//       name: "Lucas Mueller",
//       joinDate: "2024-03-15",
//       role: "Product Manager",
//       avatar: "https://github.com/shadcn.png",
//     },
//     {
//       id: 6,
//       name: "Yuki Tanaka",
//       joinDate: "2024-04-01",
//       role: "Product Manager",
//       avatar: "https://github.com/shadcn.png",
//     },
//     {
//       id: 7,
//       name: "Oliver Brown",
//       joinDate: "2024-04-15",
//       role: "DevOps Engineer",
//       avatar: "https://github.com/shadcn.png",
//     },
//     {
//       id: 8,
//       name: "Zara Patel",
//       joinDate: "2024-05-01",
//       role: "System Analyst",
//       avatar: "https://github.com/shadcn.png",
//     },
//   ];
  
  export const subscriptionOptions = ["All", "Free", "Plan A", "Plan B"];



  // export const users: UserType[] = [
  //   {
  //     id: 1,
  //     name: "John Smith",
  //     country: "United States",
  //     joinDate: "2024-01-15",
  //     subscription: "Free",
  //     avatar: "https://github.com/shadcn.png",
  //   },
  //   {
  //     id: 2,
  //     name: "Emma Wilson",
  //     country: "United Kingdom",
  //     joinDate: "2024-02-01",
  //     subscription: "Plan A",
  //     avatar: "https://github.com/shadcn.png",
  //   },
  //   {
  //     id: 3,
  //     name: "Liam Chen",
  //     country: "Singapore",
  //     joinDate: "2024-02-15",
  //     subscription: "Plan B",
  //     avatar: "https://github.com/shadcn.png",
  //   },
  //   {
  //     id: 4,
  //     name: "Sofia Rodriguez",
  //     country: "Spain",
  //     joinDate: "2024-03-01",
  //     subscription: "Free",
  //     avatar: "https://github.com/shadcn.png",
  //   },
  //   {
  //     id: 5,
  //     name: "Lucas Mueller",
  //     country: "Germany",
  //     joinDate: "2024-03-15",
  //     subscription: "Plan A",
  //     avatar: "https://github.com/shadcn.png",
  //   },
  //   {
  //     id: 6,
  //     name: "Yuki Tanaka",
  //     country: "Japan",
  //     joinDate: "2024-04-01",
  //     subscription: "Plan B",
  //     avatar: "https://github.com/shadcn.png",
  //   },
  //   {
  //     id: 7,
  //     name: "Oliver Brown",
  //     country: "Australia",
  //     joinDate: "2024-04-15",
  //     subscription: "Free",
  //     avatar: "https://github.com/shadcn.png",
  //   },
  //   {
  //     id: 8,
  //     name: "Zara Patel",
  //     country: "India",
  //     joinDate: "2024-05-01",
  //     subscription: "Plan A",
  //     avatar: "https://github.com/shadcn.png",
  //   },
  // ];




 
  
  export const topics: Topic[] = [
    {
      id: 3151,
      title: "Special Array I",
      difficulty: "Easy",
      submissions: 558900,
      acceptanceRate: 53.8,
    },
    {
      id: 3152,
      title: "Maximum Subarray Sum",
      difficulty: "Medium",
      submissions: 892450,
      acceptanceRate: 48.2,
    },
    {
      id: 3153,
      title: "Binary Tree Level Order Traversal",
      difficulty: "Medium",
      submissions: 723150,
      acceptanceRate: 62.4,
    },
    {
      id: 3154,
      title: "Dynamic Programming Patterns",
      difficulty: "Hard",
      submissions: 325780,
      acceptanceRate: 31.5,
    },
    {
      id: 3155,
      title: "Two Sum Problem",
      difficulty: "Easy",
      submissions: 1245670,
      acceptanceRate: 71.2,
    },
    {
      id: 3156,
      title: "Graph Coloring Algorithm",
      difficulty: "Hard",
      submissions: 245890,
      acceptanceRate: 28.9,
    },
    {
      id: 3157,
      title: "String Manipulation",
      difficulty: "Easy",
      submissions: 678450,
      acceptanceRate: 65.7,
    },
    {
      id: 3158,
      title: "Linked List Cycle Detection",
      difficulty: "Medium",
      submissions: 542890,
      acceptanceRate: 55.3,
    },
    {
      id: 3159,
      title: "Heap Operations",
      difficulty: "Medium",
      submissions: 389670,
      acceptanceRate: 44.8,
    },
    {
      id: 3160,
      title: "Backtracking Puzzles",
      difficulty: "Hard",
      submissions: 198450,
      acceptanceRate: 35.2,
    }
  ];
  
  
  export const trendingCompanies: TrendingCompany[] = [
    { name: "Amazon", count: 1721 },
    { name: "Meta", count: 1518 },
    { name: "Uber", count: 915 },
    { name: "Google", count: 1240 },
    { name: "Bloomberg", count: 925 },
    { name: "Apple", count: 725 },
    { name: "Oracle", count: 589 },
    { name: "Microsoft", count: 1015 },
    { name: "LinkedIn", count: 455 },
    { name: "TikTok", count: 325 },
    { name: "Adobe", count: 625 },
    { name: "Salesforce", count: 515 },
    { name: "Goldman Sachs", count: 425 },
    { name: "Walmart Labs", count: 155 },
    { name: "PayPal", count: 165 },
    { name: "Snap", count: 115 },
    { name: "Nvidia", count: 185 },
    { name: "IBM", count: 275 },
    { name: "Airbnb", count: 125 },
    { name: "DoorDash", count: 95 },
  ];


  // export const transactions: Transaction[] = [
  //   {
  //     paymentId: "3445bd2",
  //     paidBy: "Apple",
  //     dateTime: "12/12/2020",
  //     modeOfPayment: "Credit Card",
  //     amount: 324,
  //   },
  //   {
  //     paymentId: "7891cd3",
  //     paidBy: "Microsoft",
  //     dateTime: "15/12/2020",
  //     modeOfPayment: "Debit Card",
  //     amount: 499,
  //   },
  //   {
  //     paymentId: "4567ef4",
  //     paidBy: "Google",
  //     dateTime: "18/12/2020",
  //     modeOfPayment: "Net Banking",
  //     amount: 799,
  //   },
  //   {
  //     paymentId: "9012gh5",
  //     paidBy: "Amazon",
  //     dateTime: "20/12/2020",
  //     modeOfPayment: "UPI",
  //     amount: 249,
  //   },
  //   {
  //     paymentId: "2345ij6",
  //     paidBy: "Meta",
  //     dateTime: "22/12/2020",
  //     modeOfPayment: "Credit Card",
  //     amount: 599,
  //   },
  //   {
  //     paymentId: "6789kl7",
  //     paidBy: "Netflix",
  //     dateTime: "25/12/2020",
  //     modeOfPayment: "Debit Card",
  //     amount: 399,
  //   },
  //   {
  //     paymentId: "1234mn8",
  //     paidBy: "Spotify",
  //     dateTime: "27/12/2020",
  //     modeOfPayment: "UPI",
  //     amount: 199,
  //   },
  //   {
  //     paymentId: "5678pq9",
  //     paidBy: "Adobe",
  //     dateTime: "29/12/2020",
  //     modeOfPayment: "Net Banking",
  //     amount: 899,
  //   },
  //   {
  //     paymentId: "8901rs0",
  //     paidBy: "Twitter",
  //     dateTime: "31/12/2020",
  //     modeOfPayment: "Credit Card",
  //     amount: 299,
  //   },
  //   {
  //     paymentId: "3456tu1",
  //     paidBy: "LinkedIn",
  //     dateTime: "02/01/2021",
  //     modeOfPayment: "Debit Card",
  //     amount: 449,
  //   },
  //   {
  //     paymentId: "7890vw2",
  //     paidBy: "Samsung",
  //     dateTime: "05/01/2021",
  //     modeOfPayment: "UPI",
  //     amount: 649,
  //   },
  //   {
  //     paymentId: "2345xy3",
  //     paidBy: "Intel",
  //     dateTime: "07/01/2021",
  //     modeOfPayment: "Net Banking",
  //     amount: 749,
  //   }
  // ];



  export const questionsData: Question = {
    id: "1",
    title: "Making A Large Island",
    difficulty: "Hard",
    description: "You are given an n x n binary matrix grid. You are allowed to change at most one 0 to be 1. Return the size of the largest island in grid after applying this operation.",
    examples: [
        {
            input: "grid = [[1,0],[0,1]]",
            output: "3",
            explanation: "Change one 0 to 1 and connect two 1s, then we get an island with area = 3."
        },
        {
            input: "grid = [[1,1],[1,0]]",
            output: "4",
            explanation: "Change the 0 to 1 and make the island bigger, only one island with area = 4."
        }
    ],
    constraints: [
        "n == grid.length",
        "n == grid[i].length",
        "1 <= n <= 500",
        "grid[i][j] is either 0 or 1"
    ]
}
