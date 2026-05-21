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
import {
  Code,
  Layers,
  Plus,
  Search,
  ChevronsRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
// import {  trendingCompanies } from "@/constants";
import { TopicCard } from "@/components/adminDashboard/challenges/TopicCard";
import { TrendingTopics } from "@/components/adminDashboard/challenges/TrendingTopics";
import SectionHeader from "@/components/adminDashboard/SectionHeader";
import { useRouter } from "next/navigation";
import { deleteChallenge, getAllChallenges } from "@/API/challenges";
import toast from "react-hot-toast";
import Loading from "@/components/Loading";
// import { error } from "console";

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
  paymentMode?: string;
  planId?: {
    _id: string;
    name: string;
    price: number;
    priceMode: string;
  } | null;
}

const Page = () => {
  const [loading, setLoading] = useState(true);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [selectedCompany, setSelectedCompany] = useState("all");
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Get unique topics from challenges data
  const getUniqueTopics = () => {
    const allTopics = challenges.flatMap((challenge) => challenge.topic || []);
    // Remove duplicates (case-insensitive, trimmed)
    const uniqueTopicsMap = new Map();
    allTopics.forEach((topic) => {
      const key = topic.trim().toLowerCase();
      if (!uniqueTopicsMap.has(key)) {
        uniqueTopicsMap.set(key, topic.trim());
      }
    });
    return Array.from(uniqueTopicsMap.values()).map((topic) => ({
      id: topic.toLowerCase(),
      label: topic,
      icon: Code,
      color: "text-blue-500",
    }));
  };

  // Get unique companies from challenges data
  const getUniqueCompanies = () => {
    const allCompanies = challenges.flatMap(
      (challenge) => challenge.companies || []
    );
    const uniqueCompaniesMap = new Map();
    allCompanies.forEach((company) => {
      const key = company.trim().toLowerCase();
      if (!uniqueCompaniesMap.has(key)) {
        uniqueCompaniesMap.set(key, company.trim());
      }
    });
    return Array.from(uniqueCompaniesMap.values()).map((company) => ({
      id: company.toLowerCase(),
      label: company,
    }));
  };

  const topics_filter = [
    { id: "all", label: "All Topics", icon: Layers, color: "text-gray-600" },
    ...getUniqueTopics(),
  ];

  const companies_filter = [
    { id: "all", label: "All Companies" },
    ...getUniqueCompanies(),
  ];

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedDifficulty("all");
    setSelectedStatus("all");
    setSelectedTopic("all");
    setSelectedCompany("all");
    setCurrentPage(1);
  };

  const handleAddChallenge = () => {
    router.push("/admin/challenges/addChallenge");
  };

  const handleView = (id: string) => {
    router.push(`/admin/challenges/view?id=${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/challenges/edit?id=${id}`);
  };

  const getAllChallengesData = async () => {
    setLoading(true);
    try {
      const res = await getAllChallenges();

      // console.log(res?.data);
      const formattedData = res?.data?.map((item: any) => ({
        id: item?._id,
        title: item?.title,
        difficulty: item?.difficulty,
        submissions: item?.submissions || 0,
        acceptanceRate: item?.acceptanceRate || 0,
        topic: item?.topic,
        status: item?.status || "active",
        keywords: item?.keywords,
        problemStatement: item?.problemStatement,
        companies: item?.companies,
        paymentMode: item?.paymentMode,
        planId: item?.planId,
      }));
      setChallenges(formattedData);
    } catch (error) {
      console.error("Error fetching challenges:", error);
      toast.error("Error fetching challenges");
      setLoading(false);
    } finally {
      setLoading(false);
      }
  };

  useEffect(() => {
    getAllChallengesData();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteChallenge(id);
      if (res) {
        toast.success("Challenge deleted successfully");
        getAllChallengesData();
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error);
    }
  };

  const filteredChallenges = challenges.filter((challenge) => {
    const matchesSearch = challenge.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesDifficulty =
      selectedDifficulty === "all" ||
      challenge.difficulty === selectedDifficulty;
    const matchesTopic =
      selectedTopic === "all" ||
      (challenge.topic &&
        challenge.topic.some((topic) => topic.toLowerCase() === selectedTopic));
    const matchesStatus =
      selectedStatus === "all" || challenge.status === selectedStatus;
    const matchesCompany =
      selectedCompany === "all" ||
      (challenge.companies &&
        challenge.companies.some(
          (company) => company.trim().toLowerCase() === selectedCompany
        ));
    return (
      matchesSearch &&
      matchesDifficulty &&
      matchesTopic &&
      matchesStatus &&
      matchesCompany
    );
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
        pageNumbers.push("...");
        pageNumbers.push(totalPages - 1);
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push(2);
        pageNumbers.push("...");
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push("...");
        pageNumbers.push(currentPage - 1);
        pageNumbers.push(currentPage);
        pageNumbers.push(currentPage + 1);
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-7 bg-htb-bg min-h-screen">
      <div className="container mx-auto">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin" className="text-htb-muted hover:text-neon font-mono text-xs uppercase tracking-widest">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-htb-text-dim" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-neon font-mono text-xs uppercase tracking-widest">Challenges</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <SectionHeader
          title="Challenges"
          buttonText="Add Challenge"
          onButtonClick={handleAddChallenge}
          icon={<Plus className="w-3.5 h-3.5" />}
          className="mb-4 mt-3"
        />

        <div className="flex flex-col lg:flex-row gap-3 2xl:gap-6">
          {/* Main Content */}
          <div className="flex-1 min-w-[74%]">
            <div className=" rounded-lg p-4">
              <div className="relative">
                <div
                  className="flex overflow-x-auto gap-2 mb-4 scrollbar-hide"
                  style={{
                    msOverflowStyle: "none",
                    scrollbarWidth: "none",
                  }}
                >
                  {topics_filter.map((topic) => {
                    const IconComponent = topic.icon;
                    const active = selectedTopic === topic.id;
                    return (
                      <button
                        key={topic.id}
                        onClick={() => setSelectedTopic(topic.id)}
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md font-mono text-[11px] uppercase tracking-widest font-semibold border transition-all whitespace-nowrap ${
                          active
                            ? "bg-neon/10 border-neon/40 text-neon shadow-neon-sm"
                            : "bg-htb-panel border-htb-border text-htb-muted hover:border-htb-border-hover hover:text-htb-text"
                        }`}
                      >
                        <IconComponent className="h-3.5 w-3.5" />
                        <span>{topic.label}</span>
                      </button>
                    );
                  })}
                </div>
                {/* <div className="flex overflow-x-auto gap-2 mb-4 scrollbar-hide"
                  style={{ 
                    msOverflowStyle: 'none',
                    scrollbarWidth: 'none',
                  }}
                >
                  {companies_filter.map((company) => (
                    <Button
                      key={company.id}
                      variant={selectedCompany === company.id ? "default" : "ghost"}
                      className={selectedCompany === company.id ? "bg-black text-white" : ""}
                      onClick={() => setSelectedCompany(company.id)}
                    >
                      <span className={selectedCompany === company.id ? "text-white" : "text-gray-700"}>
                        {company.label}
                      </span>
                    </Button>
                  ))}
                </div> */}
                <Button
                  variant="ghost"
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-l from-htb-bg via-htb-bg to-transparent text-htb-muted hover:text-neon hover:bg-transparent"
                  onClick={() => {
                    const container =
                      document.querySelector(".overflow-x-auto");
                    if (container) {
                      container.scrollLeft += 200;
                    }
                  }}
                >
                  <ChevronsRight className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex flex-row gap-3 2xl:gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-htb-text-dim h-4 w-4 pointer-events-none" />
                    <Input
                      placeholder="Search challenges"
                      className="pl-10 font-mono text-sm"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select
                    value={selectedDifficulty}
                    onValueChange={setSelectedDifficulty}
                  >
                    <SelectTrigger className="font-mono text-xs uppercase tracking-wider">
                      <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Difficulties</SelectItem>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={selectedStatus}
                    onValueChange={setSelectedStatus}
                  >
                    <SelectTrigger className="font-mono text-xs uppercase tracking-wider">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  {/* <Select value={selectedTags} onValueChange={setSelectedTags}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tags" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tags</SelectItem>
                      <SelectItem value="array">Array</SelectItem>
                      <SelectItem value="string">String</SelectItem>
                      <SelectItem value="dp">Dynamic Programming</SelectItem>
                    </SelectContent>
                  </Select> */}
                  <Button
                    variant="outline-dim"
                    onClick={handleResetFilters}
                    className="px-4 font-mono text-xs uppercase tracking-widest"
                  >
                    Reset
                  </Button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <div className="text-[11px] font-mono uppercase tracking-widest text-htb-text-dim">
                    Showing <span className="text-neon font-semibold">{filteredChallenges.length}</span> of <span className="text-htb-text font-semibold">{challenges.length}</span> challenges
                  </div>
                  {selectedTopic !== "all" && (
                    <div className="text-[11px] font-mono uppercase tracking-widest text-sky-300">
                      Topic: {topics_filter.find((t) => t.id === selectedTopic)?.label}
                    </div>
                  )}
                  {selectedCompany !== "all" && (
                    <div className="text-[11px] font-mono uppercase tracking-widest text-purple-300">
                      Company: {companies_filter.find((c) => c.id === selectedCompany)?.label}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2  gap-2 2xl:gap-4">
                  {getCurrentPageItems().map(
                    (challenge: Challenge, index: number) => (
                      <TopicCard
                        key={challenge?.id}
                        challenge={challenge}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        index={index}
                      />
                    )
                  )}
                </div>

                {/* Pagination UI */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-1.5 mt-6 flex-wrap">
                    <Button
                      variant="outline-dim"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="font-mono text-[11px] uppercase tracking-widest"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                      <span className="ml-1">Prev</span>
                    </Button>

                    {getPageNumbers().map((pageNum, idx) => (
                      <button
                        key={idx}
                        onClick={() =>
                          pageNum !== "..." && setCurrentPage(Number(pageNum))
                        }
                        disabled={pageNum === "..."}
                        className={`min-w-[36px] h-9 rounded-md font-mono text-xs font-semibold transition-colors ${
                          pageNum === "..."
                            ? "cursor-default text-htb-text-dim"
                            : currentPage === pageNum
                            ? "bg-neon text-white shadow-neon-sm"
                            : "border border-htb-border bg-htb-panel text-htb-muted hover:border-neon/40 hover:text-neon"
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}

                    <Button
                      variant="outline-dim"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="font-mono text-[11px] uppercase tracking-widest"
                    >
                      <span className="mr-1">Next</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Trending Topics Sidebar */}
          {/* <div className="min-w-[24%]">
            <TrendingTopics
              companies={getUniqueCompanies().map((company) => ({
                name: company.label,
                count: challenges.filter((ch) =>
                  (ch.companies || []).some(
                    (c) => c.trim().toLowerCase() === company.id
                  )
                ).length,
              }))}
              selectedCompany={selectedCompany}
              setSelectedCompany={setSelectedCompany}
            />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Page;
