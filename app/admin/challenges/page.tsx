"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Activity, Code, Database, Layers, Plus, Search, Terminal, ChevronsRight, ChevronLeft, ChevronRight } from "lucide-react";
import {  trendingCompanies } from "@/constants";
import { TopicCard } from "@/components/adminDashboard/challenges/TopicCard";
import { TrendingTopics } from "@/components/adminDashboard/challenges/TrendingTopics";
import SectionHeader from "@/components/adminDashboard/SectionHeader";
import { useRouter } from "next/navigation";
import { deleteChallenge, getAllChallenges } from "@/API/challenges";
import toast from "react-hot-toast";
import { error } from "console";


interface Challenge {
  id?: string;
  _id?: string;
  title: string;
  difficulty: string;
  topic: string[];
  keywords: string[];
  problemStatement: string;
  files: any[];
  submissions: number;
  acceptanceRate: number;
  status: string;
  companies?: string[];
}


const Page = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedTags, setSelectedTags] = useState<string>("all");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const topics_filter = [
    { id: "all", label: "All Topics", icon: Layers, color: "text-gray-600" },
    { id: "algorithms", label: "Algorithms", icon: Code, color: "text-blue-500" },
    { id: "database", label: "Database", icon: Database, color: "text-green-500" },
    { id: "shell", label: "Shell", icon: Terminal, color: "text-yellow-500" },
    { id: "concurrency", label: "Concurrency", icon: Activity, color: "text-purple-500" },
    { id: "javascript", label: "JavaScript", icon: Code, color: "text-orange-500" },
  ];

  const handleAddChallenge = () => {
    router.push("/admin/challenges/addChallenge");
  };

  const handleView = (id: string) => {
    router.push(`/admin/challenges/view?id=${id}`);
  };
  
  const handleEdit = (id: string) => {
    router.push(`/admin/challenges/edit?id=${id}`);
  };
  
  const handleDelete = async (id: string) => {
    try {
      const res = await deleteChallenge(id);
      if(res){
        toast.success("Challenge deleted successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete challenge");
    }
  };

  useEffect(() => {
    const getAllChallengesData = async () => {
      
      try {
        const res = await getAllChallenges();
     
        console.log(res?.data);
        const formattedData = res?.data?.map((item: Challenge) => ({ 
          id: item?._id,
          title: item?.title,
          difficulty: item?.difficulty,
          submissions: item?.submissions || 0,
          acceptanceRate: item?.acceptanceRate || 0,
          topic: item?.topic,
          status: item?.status || 'active',
          keywords: item?.keywords,
          problemStatement: item?.problemStatement,
          companies: item?.companies,
       
        }));
        setChallenges(formattedData);
      } catch (error) {
        console.error('Error fetching challenges:', error);
      }
    };
    getAllChallengesData();
  }, []);



  const filteredChallenges = challenges.filter((challenge) => { 
    const matchesSearch = challenge.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesDifficulty =
      selectedDifficulty === "all" || challenge.difficulty === selectedDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  // Calculate total pages
  const totalPages = Math.ceil(filteredChallenges.length / itemsPerPage);

  // Get current page items
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredChallenges.slice(startIndex, endIndex);
  };

  // Generate page numbers array with ellipsis
  const getPageNumbers = () => {
    const pageNumbers = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 3; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages - 1);
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push(2);
        pageNumbers.push('...');
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        pageNumbers.push(currentPage - 1);
        pageNumbers.push(currentPage);
        pageNumbers.push(currentPage + 1);
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };

  return (
    <div className="p-7 bg-gray-50">
      <div className="container mx-auto ">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Challenges</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <SectionHeader
          title="Challenges"
          buttonText="Add Challenge"
          onButtonClick={handleAddChallenge}
          icon={<Plus />}
          className="mb-4"
        />

        <div className="flex flex-col lg:flex-row gap-3 2xl:gap-6">
          {/* Main Content */}
          <div className="flex-1 min-w-[74%]">
            <div className=" rounded-lg p-4">
              <div className="relative">
                <div className="flex overflow-x-auto gap-2 mb-4 scrollbar-hide" 
                  style={{ 
                    msOverflowStyle: 'none',
                    scrollbarWidth: 'none',
                  }}
                >
                  {topics_filter.map((topic) => {
                    const IconComponent = topic.icon;
                    return (
                      <Button
                        key={topic.id}
                        variant={selectedTopic === topic.id ? "default" : "ghost"}
                        className={selectedTopic === topic.id ? "bg-black text-white" : ""}
                        onClick={() => setSelectedTopic(topic.id)}
                      >
                        <IconComponent 
                          className={`h-4 w-4  ${
                            selectedTopic === topic.id 
                              ? "text-white" 
                              : topic.color
                          }`}
                        />
                        <span className={selectedTopic === topic.id ? "text-white" : "text-gray-700"}>
                          {topic.label}
                        </span>
                      </Button>
                    );
                  })}
                </div>
                <Button 
                  variant="ghost" 
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-l from-gray-50 via-gray-50 to-transparent"
                  onClick={() => {
                    const container = document.querySelector('.overflow-x-auto');
                    if (container) {
                      container.scrollLeft += 200;
                    }
                  }}
                >
                  <ChevronsRight className="h-5 w-5" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search challenges"
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Difficulties</SelectItem>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedTags} onValueChange={setSelectedTags}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tags" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tags</SelectItem>
                    <SelectItem value="array">Array</SelectItem>
                    <SelectItem value="string">String</SelectItem>
                    <SelectItem value="dp">Dynamic Programming</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2  gap-2 2xl:gap-4">
                  {challenges?.map((challenge: Challenge ,index: number) => (
                    <TopicCard
                      key={challenge?.id}
                      challenge={challenge} 
                      onView={handleView}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      index={index}
                    />
                  ))}
                </div>
                
                {/* Pagination UI */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="ml-2">Previous</span>
                    </Button>
                    
                    {getPageNumbers().map((pageNum, idx) => (
                      <Button
                        key={idx}
                        variant={currentPage === pageNum ? "outline" : "outline"}
                        className={`min-w-[40px] ${
                          pageNum === '...' 
                            ? 'cursor-default hover:bg-transparent' 
                            : currentPage === pageNum
                              ? 'bg-[#7E22CE] text-white hover:bg-[#7E22CE] border-[#7E22CE]'
                              : ''
                        }`}
                        onClick={() => pageNum !== '...' && setCurrentPage(Number(pageNum))}
                        disabled={pageNum === '...'}
                      >
                        {pageNum}
                      </Button>
                    ))}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      <span className="mr-2">Next</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Trending Topics Sidebar */}
          <div className="min-w-[24%]">
            <TrendingTopics companies={trendingCompanies} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;