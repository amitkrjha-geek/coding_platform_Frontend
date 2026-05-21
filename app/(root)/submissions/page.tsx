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
      // console.log("📊 Response:", response);

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
        return <CheckCircle className="w-4 h-4 text-neon" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-danger" />;
      case 'submitted':
        return <Clock className="w-4 h-4 text-warn" />;
      case 'compiled':
        return <CheckCircle className="w-4 h-4 text-sky-300" />;
      default:
        return <AlertCircle className="w-4 h-4 text-htb-text-dim" />;
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
        return 'text-neon';
      case 'error':
        return 'text-danger';
      case 'submitted':
        return 'text-warn';
      case 'compiled':
        return 'text-sky-300';
      default:
        return 'text-htb-muted';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'border-neon/30 bg-neon/10 text-neon';
      case 'medium':
        return 'border-warn/30 bg-warn/10 text-warn';
      case 'hard':
        return 'border-danger/30 bg-danger/10 text-danger';
      default:
        return 'border-htb-border bg-htb-panel-2 text-htb-muted';
    }
  };

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-htb-bg">
        <div className="panel p-8 text-center max-w-sm">
          <span className="terminal-eyebrow inline-flex justify-center mb-3">access.required</span>
          <h2 className="text-xl font-bold text-htb-text mb-4">Please log in to view submissions</h2>
          <button
            onClick={() => router.push('/sign-in')}
            className="bg-neon text-white font-mono text-xs uppercase tracking-widest font-semibold px-6 py-2.5 rounded-md hover:shadow-neon-sm hover:-translate-y-0.5 transition-all"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-htb-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6 gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => router.back()}
                aria-label="Back"
                className="flex items-center justify-center w-9 h-9 rounded-md border border-htb-border text-htb-muted hover:text-neon hover:border-neon/40 transition-colors shrink-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="min-w-0">
                <span className="terminal-eyebrow">submissions.log</span>
                <h1 className="heading-display text-2xl sm:text-3xl text-htb-text truncate">
                  My Submissions{" "}
                  <span className="font-mono text-neon">
                    ({pagination?.totalSubmissions || 0})
                  </span>
                </h1>
              </div>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 h-10 rounded-md border border-htb-border bg-htb-panel text-htb-muted hover:text-neon hover:border-neon/40 transition-colors font-mono text-xs uppercase tracking-widest font-semibold shrink-0"
            >
              <Filter className="w-3.5 h-3.5" />
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
            className="panel p-5 mb-6"
          >
            <span className="terminal-eyebrow mb-4 inline-block">filter.config</span>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-3">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest font-semibold text-htb-muted mb-1.5">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-htb-bg border border-htb-border text-htb-text font-mono text-xs uppercase tracking-wider hover:border-htb-border-hover focus:border-neon/60 focus:ring-1 focus:ring-neon/40 outline-none transition-colors"
                >
                  <option value="">All Status</option>
                  <option value="evaluated">Evaluated</option>
                  <option value="submitted">Submitted</option>
                  <option value="compiled">Compiled</option>
                  <option value="error">Error</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest font-semibold text-htb-muted mb-1.5">Language</label>
                <select
                  value={filters.language}
                  onChange={(e) => handleFilterChange('language', e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-htb-bg border border-htb-border text-htb-text font-mono text-xs uppercase tracking-wider hover:border-htb-border-hover focus:border-neon/60 focus:ring-1 focus:ring-neon/40 outline-none transition-colors"
                >
                  <option value="">All Languages</option>
                  <option value="c">C</option>
                  <option value="cpp">C++</option>
                  <option value="c#">C#</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest font-semibold text-htb-muted mb-1.5">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-htb-bg border border-htb-border text-htb-text font-mono text-xs uppercase tracking-wider hover:border-htb-border-hover focus:border-neon/60 focus:ring-1 focus:ring-neon/40 outline-none transition-colors"
                >
                  <option value="lastUpdated">Last Updated</option>
                  <option value="createdAt">Created Date</option>
                  <option value="score">Score</option>
                  <option value="executionTime">Execution Time</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest font-semibold text-htb-muted mb-1.5">Order</label>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => handleFilterChange('sortOrder', 'desc')}
                    className={`flex items-center gap-1 px-3 py-2 rounded-md border font-mono text-[11px] uppercase tracking-widest font-semibold transition-colors ${
                      filters.sortOrder === 'desc'
                        ? 'bg-neon/10 border-neon/40 text-neon'
                        : 'bg-htb-bg border-htb-border text-htb-muted hover:border-htb-border-hover hover:text-htb-text'
                    }`}
                  >
                    <SortDesc className="w-3.5 h-3.5" />
                    Desc
                  </button>
                  <button
                    onClick={() => handleFilterChange('sortOrder', 'asc')}
                    className={`flex items-center gap-1 px-3 py-2 rounded-md border font-mono text-[11px] uppercase tracking-widest font-semibold transition-colors ${
                      filters.sortOrder === 'asc'
                        ? 'bg-neon/10 border-neon/40 text-neon'
                        : 'bg-htb-bg border-htb-border text-htb-muted hover:border-htb-border-hover hover:text-htb-text'
                    }`}
                  >
                    <SortAsc className="w-3.5 h-3.5" />
                    Asc
                  </button>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button
                onClick={applyFilters}
                className="px-4 py-2 bg-neon text-white font-mono text-xs uppercase tracking-widest font-semibold rounded-md hover:shadow-neon-sm hover:-translate-y-0.5 transition-all"
              >
                Apply Filters
              </button>
              <button
                onClick={clearFilters}
                className="px-4 py-2 border border-htb-border bg-htb-panel text-htb-muted hover:text-neon hover:border-neon/40 font-mono text-xs uppercase tracking-widest font-semibold rounded-md transition-colors"
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
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon"></div>
            </div>
          ) : error ? (
            <div className="panel p-6 text-center border-danger/30">
              <p className="text-danger font-medium">{error}</p>
              <button
                onClick={() => fetchSubmissions(1, true)}
                className="mt-4 px-4 py-2 bg-danger text-white rounded-md hover:bg-danger/80 transition-colors font-mono text-xs uppercase tracking-widest font-semibold"
              >
                Try Again
              </button>
            </div>
          ) : submissions.length === 0 ? (
            <div className="panel p-12 text-center">
              <div className="w-16 h-16 rounded-md border border-htb-border bg-htb-bg/40 flex items-center justify-center mx-auto mb-4">
                <Code className="w-7 h-7 text-htb-text-dim" />
              </div>
              <span className="terminal-eyebrow inline-flex justify-center mb-2">no_submissions</span>
              <h3 className="text-xl font-semibold text-htb-text mb-2">No submissions found</h3>
              <p className="text-htb-muted mb-6 max-w-md mx-auto text-sm">
                Start solving challenges to see your submissions and track your progress here.
              </p>
              <button
                onClick={() => router.push('/Challenges')}
                className="px-6 py-3 bg-neon text-white rounded-md hover:shadow-neon-sm hover:-translate-y-0.5 transition-all font-mono text-xs uppercase tracking-widest font-semibold"
              >
                Browse Challenges
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
              {submissions?.map((submission, index) => (
                <motion.div
                  key={submission?._id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="group panel panel-hover p-5 cursor-pointer h-full transition-all"
                  onClick={() => router.push(`/challenges/${submission?.challenge?._id}`)}
                >
                  <div className="flex flex-col h-full">
                    {/* Header with title and difficulty */}
                    <div className="mb-4">
                      <h3 className="text-base sm:text-lg font-semibold text-htb-text group-hover:text-neon transition-colors mb-2 line-clamp-2">
                        {submission?.challenge?.title}
                      </h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded font-mono text-[10px] font-semibold uppercase tracking-widest border ${getDifficultyColor(submission?.challenge?.difficulty)}`}>
                          {submission?.challenge?.difficulty}
                        </span>
                        {submission?.challenge?.category && (
                          <span className="text-xs font-mono uppercase tracking-wider text-htb-text-dim">
                            {submission?.challenge?.category}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Status and metadata row */}
                    <div className="flex flex-col gap-2 text-sm mb-4 flex-grow">
                      <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <Code className="w-3.5 h-3.5 text-htb-text-dim" />
                          <span className="font-mono text-xs uppercase tracking-wider text-htb-muted">
                            {submission?.language?.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {getStatusIcon(submission?.status)}
                          <span className={`font-mono text-xs uppercase tracking-wider font-semibold ${getStatusColor(submission?.status)}`}>
                            {getStatusText(submission?.status)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-htb-text-dim" />
                        <span className="text-htb-text-dim text-xs font-mono">
                          {formatDateTime(submission?.lastUpdated)}
                        </span>
                      </div>
                    </div>

                    {/* Performance metrics for evaluated submissions */}
                    {submission?.status === 'evaluated' && (
                      <div className="rounded-md border border-htb-border bg-htb-bg/40 p-3 mt-auto">
                        <div className="grid grid-cols-4 gap-2 text-center">
                          <div>
                            <div className="font-mono text-base font-bold text-neon tabular-nums">
                              {submission?.score}
                            </div>
                            <div className="text-[10px] font-mono uppercase tracking-widest text-htb-text-dim mt-0.5">
                              Score
                            </div>
                          </div>
                          <div>
                            <div className="font-mono text-base font-bold text-htb-text tabular-nums">
                              {submission?.testsPassed}/{submission?.totalTests}
                            </div>
                            <div className="text-[10px] font-mono uppercase tracking-widest text-htb-text-dim mt-0.5">
                              Tests
                            </div>
                          </div>
                          <div>
                            <div className="font-mono text-base font-bold text-htb-text tabular-nums">
                              {submission?.executionTime}<span className="text-xs text-htb-text-dim">ms</span>
                            </div>
                            <div className="text-[10px] font-mono uppercase tracking-widest text-htb-text-dim mt-0.5">
                              Time
                            </div>
                          </div>
                          <div>
                            <div className="font-mono text-base font-bold text-htb-text tabular-nums">
                              {submission?.memoryUsed}<span className="text-xs text-htb-text-dim">KB</span>
                            </div>
                            <div className="text-[10px] font-mono uppercase tracking-widest text-htb-text-dim mt-0.5">
                              Memory
                            </div>
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
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-neon"></div>
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
