"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { getCurrentUserId } from "@/config/token";
import { getPaginatedSubmissions } from "@/API/submission";
import { formatDateTime } from "@/utils";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ChevronLeft, Filter, SortAsc, SortDesc, Code, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface Submission {
  _id: string;
  challenge: {
    _id: string;
    title: string;
    difficulty: string;
    category: string;
  };
  language: string;
  status: 'compiled' | 'submitted' | 'evaluated' | 'error';
  score: number;
  executionTime: number;
  memoryUsed: number;
  testsPassed: number;
  totalTests: number;
  createdAt: string;
  lastUpdated: string;
  submittedAt?: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalSubmissions: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
}

const SubmissionsPage = () => {
  const router = useRouter();
  const userId = getCurrentUserId();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: '',
    language: '',
    sortBy: 'lastUpdated',
    sortOrder: 'desc' as 'asc' | 'desc'
  });
  const [showFilters, setShowFilters] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  const fetchSubmissions = useCallback(async (page: number = 1, reset: boolean = false) => {
    if (!userId) return;

    try {
      if (reset) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      const response = await getPaginatedSubmissions(
        userId,
        page,
        10,
        filters
      );
      console.log("📊 Response:", response);

      if (response.success) {
        const newSubmissions = response.data.submissions;
        const paginationInfo = response.data.pagination;

        if (reset) {
          setSubmissions(newSubmissions);
        } else {
          setSubmissions(prev => [...prev, ...newSubmissions]);
        }
        setPagination(paginationInfo);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch submissions");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [userId, filters]);

  // Initial load
  useEffect(() => {
    fetchSubmissions(1, true);
  }, [fetchSubmissions]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && pagination?.hasNextPage && !loadingMore) {
          fetchSubmissions(pagination.currentPage + 1, false);
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [pagination, loadingMore, fetchSubmissions]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    fetchSubmissions(1, true);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      language: '',
      sortBy: 'lastUpdated',
      sortOrder: 'desc'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'evaluated':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'submitted':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'compiled':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'evaluated':
        return 'Success';
      case 'error':
        return 'Error';
      case 'submitted':
        return 'Pending';
      case 'compiled':
        return 'Compiled';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'evaluated':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'submitted':
        return 'text-yellow-600';
      case 'compiled':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view submissions</h2>
          <button
            onClick={() => router.push('/sign-in')}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Submissions ({pagination?.totalSubmissions || 0})</h1>
                <p className="text-gray-600 mt-1">Track your coding progress and submission history</p>
              </div>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>

          {/* Stats */}
          {/* {pagination && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">{pagination.totalSubmissions}</div>
                  <div className="text-sm text-gray-500 font-medium">Total Submissions</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    {submissions.filter(s => s?.status === 'evaluated').length}
                  </div>
                  <div className="text-sm text-gray-500 font-medium">Successfully Evaluated</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600 mb-1">
                    {submissions.filter(s => s?.status === 'submitted').length}
                  </div>
                  <div className="text-sm text-gray-500 font-medium">Pending Evaluation</div>
                </div>
              </div>
            </div>
          )} */}
        </div>

        {/* Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-lg p-6 mb-6 shadow-sm"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="evaluated">Evaluated</option>
                  <option value="submitted">Submitted</option>
                  <option value="compiled">Compiled</option>
                  <option value="error">Error</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                <select
                  value={filters.language}
                  onChange={(e) => handleFilterChange('language', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">All Languages</option>
                  <option value="c">C</option>
                  <option value="cpp">C++</option>
                  <option value="c#">C#</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="lastUpdated">Last Updated</option>
                  <option value="createdAt">Created Date</option>
                  <option value="score">Score</option>
                  <option value="executionTime">Execution Time</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleFilterChange('sortOrder', 'desc')}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg border ${
                      filters.sortOrder === 'desc'
                        ? 'bg-purple-100 border-purple-300 text-purple-700'
                        : 'bg-white border-gray-300 text-gray-700'
                    }`}
                  >
                    <SortDesc className="w-4 h-4" />
                    Desc
                  </button>
                  <button
                    onClick={() => handleFilterChange('sortOrder', 'asc')}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg border ${
                      filters.sortOrder === 'asc'
                        ? 'bg-purple-100 border-purple-300 text-purple-700'
                        : 'bg-white border-gray-300 text-gray-700'
                    }`}
                  >
                    <SortAsc className="w-4 h-4" />
                    Asc
                  </button>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={applyFilters}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Apply Filters
              </button>
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Clear
              </button>
            </div>
          </motion.div>
        )}

        {/* Submissions List */}
        <div>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-600">{error}</p>
              <button
                onClick={() => fetchSubmissions(1, true)}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : submissions.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Code className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No submissions found</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">Start solving challenges to see your submissions and track your progress here.</p>
              <button
                onClick={() => router.push('/Challenges')}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                Browse Challenges
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {submissions?.map((submission, index) => (
                <motion.div
                  key={submission?._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-100 h-full"
                  onClick={() => router.push(`/${submission?.challenge?._id}`)}
                >
                  <div className="flex flex-col h-full">
                    {/* Header with title and difficulty */}
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-purple-600 transition-colors mb-2 line-clamp-2">
                        {submission?.challenge?.title}
                      </h3>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(submission?.challenge?.difficulty)}`}>
                          {submission?.challenge?.difficulty}
                        </span>
                        <span className="text-sm text-gray-500">
                          {submission?.challenge?.category}
                        </span>
                      </div>
                    </div>
                    
                    {/* Status and metadata row */}
                    <div className="flex flex-col gap-3 text-sm mb-4 flex-grow">
                      <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-2">
                          <Code className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-700">{submission?.language?.toUpperCase()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(submission?.status)}
                          <span className={`font-medium ${getStatusColor(submission?.status)}`}>
                            {getStatusText(submission?.status)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 text-xs">{formatDateTime(submission?.lastUpdated)}</span>
                      </div>
                    </div>

                    {/* Performance metrics for evaluated submissions */}
                    {submission?.status === 'evaluated' && (
                      <div className="bg-gray-50 rounded-lg p-3 mt-auto">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="text-center">
                            <div className="text-lg font-bold text-gray-900">{submission?.score}</div>
                            <div className="text-xs text-gray-500 uppercase tracking-wide">Score</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-gray-900">{submission?.testsPassed}/{submission?.totalTests}</div>
                            <div className="text-xs text-gray-500 uppercase tracking-wide">Tests</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-gray-900">{submission?.executionTime}ms</div>
                            <div className="text-xs text-gray-500 uppercase tracking-wide">Time</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-gray-900">{submission?.memoryUsed}KB</div>
                            <div className="text-xs text-gray-500 uppercase tracking-wide">Memory</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Loading more indicator */}
          {loadingMore && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
            </div>
          )}

          {/* Infinite scroll trigger */}
          <div ref={observerRef} className="h-4" />
        </div>
      </div>
    </div>
  );
};

export default SubmissionsPage;
