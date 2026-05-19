import React, { useEffect, useState } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Transaction } from '@/types';
import { getAllPayments } from '@/API/payment';
import { formatDateTime } from '@/utils';


const TransactionsTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.paymentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.paidBy.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = category === "all" || transaction.plan === category;
    
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime();
    } else if (sortBy === "amount") {
      return (b.amount || 0) - (a.amount || 0);
    }
    return 0;
  });

  // Calculate total pages
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  // Get current page transactions
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredTransactions.slice(startIndex, endIndex);
  };



  useEffect(() => {
   
    const fetchTransactions = async () => {
      try {
        const response = await getAllPayments();
        // console.log("response",response);
        const formattedTransactions = response.data.map((transaction: any) => ({
          paymentId: transaction.txnId,
          paidBy: transaction.customerName,
          dateTime: transaction.createdAt,
          modeOfPayment: transaction.paymentMode,
          amount: transaction.amount,
          currency: transaction.currency,
          coupon: transaction.couponId?.code,
          plan: transaction.planId?.name,
        }));
        // console.log("formattedTransactions",formattedTransactions);
        setTransactions(formattedTransactions);
        
      } catch (error) {
        console.error("Failed to fetch transactions", error);
      }
    };
    fetchTransactions();
  }, []);
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 2) {
        end = 4;
      }
      if (currentPage >= totalPages - 2) {
        start = totalPages - 3;
      }

      if (start > 2) {
        pageNumbers.push('...');
      }

      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }

      if (end < totalPages - 1) {
        pageNumbers.push('...');
      }

      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePrevious = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
    setCurrentPage(1); // Reset to first page when sorting
  };

  const clearFilters = () => {
    setSearchTerm("");
    setCategory("all");
    setSortBy("all");
    setCurrentPage(1);
  };

  return (
    <div className="mt-2">
      <div className="flex gap-3 mb-4 flex-wrap">
        <div className="flex-1 min-w-[240px] relative">
          <input
            type="text"
            placeholder="Enter Name or Payment ID"
            className="w-full p-2.5 pl-3 pr-10 border border-htb-border bg-htb-panel text-htb-text rounded-md font-mono text-sm placeholder:text-htb-text-dim hover:border-htb-border-hover focus:border-neon/60 focus:ring-1 focus:ring-neon/40 outline-none transition-colors"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-htb-text-dim pointer-events-none">
            <Search size={16} />
          </div>
        </div>
        <select
          className="p-2.5 border border-htb-border bg-htb-panel text-htb-text rounded-md font-mono text-xs uppercase tracking-wider hover:border-htb-border-hover focus:border-neon/60 focus:ring-1 focus:ring-neon/40 outline-none transition-colors"
          value={category}
          onChange={handleCategoryChange}
        >
          <option value="all">All Plans</option>
          <option value="BASIC">Basic</option>
          <option value="PREMIUM">Premium</option>
          <option value="ENTERPRISE">Enterprise</option>
          <option value="MONTHLY">Monthly</option>
          <option value="YEARLY">Yearly</option>
          <option value="PER_CHALLENGE">Per Challenge</option>
        </select>
        <select
          className="p-2.5 border border-htb-border bg-htb-panel text-htb-text rounded-md font-mono text-xs uppercase tracking-wider hover:border-htb-border-hover focus:border-neon/60 focus:ring-1 focus:ring-neon/40 outline-none transition-colors"
          value={sortBy}
          onChange={handleSortChange}
        >
          <option value="all">Sort by</option>
          <option value="date">Date & Time</option>
          <option value="amount">Amount</option>
        </select>
        <button
          onClick={clearFilters}
          className="px-4 py-2 border border-htb-border bg-htb-panel text-htb-muted hover:text-neon hover:border-neon/40 rounded-md transition-colors font-mono text-xs uppercase tracking-widest font-semibold"
        >
          Clear
        </button>
      </div>

      {/* Filter Status */}
      {(searchTerm || category !== "all" || sortBy !== "all") && (
        <div className="mb-4 p-3 rounded-md border border-neon/20 bg-neon/5">
          <div className="flex items-center gap-2 text-xs flex-wrap">
            <span className="font-mono uppercase tracking-widest text-neon font-semibold">Active:</span>
            {searchTerm && (
              <span className="px-2 py-0.5 rounded font-mono text-[10px] uppercase tracking-widest border border-neon/30 bg-neon/10 text-neon">
                Search: &quot;{searchTerm}&quot;
              </span>
            )}
            {category !== "all" && (
              <span className="px-2 py-0.5 rounded font-mono text-[10px] uppercase tracking-widest border border-neon/30 bg-neon/10 text-neon">
                Plan: {category}
              </span>
            )}
            {sortBy !== "all" && (
              <span className="px-2 py-0.5 rounded font-mono text-[10px] uppercase tracking-widest border border-neon/30 bg-neon/10 text-neon">
                Sort: {sortBy === "date" ? "Date & Time" : "Amount"}
              </span>
            )}
          </div>
        </div>
      )}

      <h3 className="terminal-eyebrow mb-3 inline-block">
        payment.history ({filteredTransactions.length} transactions)
      </h3>

      <div className="panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px]">
            <thead>
              <tr className="border-b border-htb-border bg-htb-bg/40">
                <th className="p-3 text-left text-[10px] font-mono font-semibold text-htb-muted uppercase tracking-widest w-32">Payment ID</th>
                <th className="p-3 text-left text-[10px] font-mono font-semibold text-htb-muted uppercase tracking-widest w-24">Paid By</th>
                <th className="p-3 text-left text-[10px] font-mono font-semibold text-htb-muted uppercase tracking-widest w-36">Date & Time</th>
                <th className="p-3 text-left text-[10px] font-mono font-semibold text-htb-muted uppercase tracking-widest w-20">Method</th>
                <th className="p-3 text-left text-[10px] font-mono font-semibold text-htb-muted uppercase tracking-widest w-20">Amount</th>
                <th className="p-3 text-left text-[10px] font-mono font-semibold text-htb-muted uppercase tracking-widest w-16">Currency</th>
                <th className="p-3 text-left text-[10px] font-mono font-semibold text-htb-muted uppercase tracking-widest w-20">Coupon</th>
                <th className="p-3 text-left text-[10px] font-mono font-semibold text-htb-muted uppercase tracking-widest w-20">Plan</th>
              </tr>
            </thead>
            <tbody>
              {getCurrentPageItems().map((transaction) => (
                <tr key={transaction.paymentId} className="border-t border-htb-border hover:bg-neon/5 transition-colors">
                  <td className="p-3 text-sm">
                    <div className="font-mono text-xs bg-htb-bg border border-htb-border px-2 py-1 rounded text-htb-muted">
                      {transaction.paymentId}
                    </div>
                  </td>
                  <td className="p-3 text-sm font-medium text-htb-text">{transaction.paidBy}</td>
                  <td className="p-3 text-xs text-htb-muted font-mono">
                    {formatDateTime(transaction.dateTime)}
                  </td>
                  <td className="p-3 text-sm">
                    <span className="inline-flex items-center px-2 py-0.5 rounded font-mono text-[10px] font-semibold uppercase tracking-widest border border-neon/30 bg-neon/10 text-neon">
                      {transaction.modeOfPayment}
                    </span>
                  </td>
                  <td className="p-3 text-sm font-mono font-bold text-neon tabular-nums">
                    ₹{transaction.amount?.toLocaleString()}
                  </td>
                  <td className="p-3 text-xs text-htb-text-dim font-mono">{transaction.currency}</td>
                  <td className="p-3 text-sm">
                    {transaction.coupon ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded font-mono text-[10px] font-semibold uppercase tracking-widest border border-purple-500/30 bg-purple-500/10 text-purple-300">
                        {transaction.coupon}
                      </span>
                    ) : (
                      <span className="text-htb-text-dim">-</span>
                    )}
                  </td>
                  <td className="p-3 text-sm">
                    <span className="inline-flex items-center px-2 py-0.5 rounded font-mono text-[10px] font-semibold uppercase tracking-widest border border-sky-400/30 bg-sky-400/10 text-sky-300">
                      {transaction.plan}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-3 flex justify-center items-center gap-1.5 border-t border-htb-border flex-wrap">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className={`px-3 py-1.5 border border-htb-border bg-htb-panel text-htb-muted hover:text-neon hover:border-neon/40 rounded-md flex items-center gap-1 font-mono text-[11px] uppercase tracking-widest font-semibold transition-colors ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <ChevronLeft className="h-3.5 w-3.5" /> Prev
          </button>

          {getPageNumbers().map((pageNum, index) =>
            pageNum === "..." ? (
              <span key={`dots-${index}`} className="px-2 text-htb-text-dim">...</span>
            ) : (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum as number)}
                className={`min-w-[36px] h-9 rounded-md font-mono text-xs font-semibold transition-colors ${
                  currentPage === pageNum
                    ? "bg-neon text-white shadow-neon-sm"
                    : "border border-htb-border bg-htb-panel text-htb-muted hover:border-neon/40 hover:text-neon"
                }`}
              >
                {pageNum}
              </button>
            )
          )}

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-3 py-1.5 border border-htb-border bg-htb-panel text-htb-muted hover:text-neon hover:border-neon/40 rounded-md flex items-center gap-1 font-mono text-[11px] uppercase tracking-widest font-semibold transition-colors ${
              currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Next <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionsTable; 