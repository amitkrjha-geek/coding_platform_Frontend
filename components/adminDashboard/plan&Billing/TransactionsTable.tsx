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
        console.log("response",response);
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
        console.log("formattedTransactions",formattedTransactions);
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
    <div className="mt-4">
      <div className="flex gap-4 mb-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Enter Name or Payment ID"
            className="w-full p-2 pl-3 pr-10 border-2 rounded-md border-purple focus:border-purple focus:outline-none focus:ring-0" 
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={20} />
          </div>
        </div>
        <select
          className="p-2 border-2 rounded-md border-purple focus:border-purple focus:outline-none focus:ring-0" 
          value={category}
          onChange={handleCategoryChange}
        >
          <option value="all">All Plans</option>
          <option value="BASIC">Basic</option>
          <option value="PREMIUM">Premium</option>
          <option value="ENTERPRISE">Enterprise</option>
        </select>
        <select
          className="p-2 border-2 rounded-md border-purple focus:border-purple focus:outline-none focus:ring-0" 
          value={sortBy}
          onChange={handleSortChange}
        >
          <option value="all">Sort by</option>
          <option value="date">Date & Time</option>
          <option value="amount">Amount</option>
        </select>
        <button
          onClick={clearFilters}
          className="px-4 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors"
        >
          Clear Filters
        </button>
      </div>

      {/* Filter Status */}
      {(searchTerm || category !== "all" || sortBy !== "all") && (
        <div className="mb-4 p-3 bg-blue-50 rounded-md">
          <div className="flex items-center gap-2 text-sm text-blue-700">
            <span className="font-medium">Active Filters:</span>
            {searchTerm && (
              <span className="px-2 py-1 bg-blue-100 rounded-full">
                Search: &quot;{searchTerm}&quot;
              </span>
            )}
            {category !== "all" && (
              <span className="px-2 py-1 bg-blue-100 rounded-full">
                Plan: {category}
              </span>
            )}
            {sortBy !== "all" && (
              <span className="px-2 py-1 bg-blue-100 rounded-full">
                Sort: {sortBy === "date" ? "Date & Time" : "Amount"}
              </span>
            )}
          </div>
        </div>
      )}

      <h3 className="font-manrope font-semibold text-base leading-[21.86px] text-purple mb-4">
        Payment History ({filteredTransactions.length} transactions)
      </h3>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px]">
            <thead>
              <tr className="border-b bg-[#7421931A]">
                <th className="p-3 text-left text-sm font-medium text-gray-700 w-32">Payment ID</th>
                <th className="p-3 text-left text-sm font-medium text-gray-700 w-24">Paid By</th>
                <th className="p-3 text-left text-sm font-medium text-gray-700 w-36">Date & Time</th>
                <th className="p-3 text-left text-sm font-medium text-gray-700 w-20">Method</th>
                <th className="p-3 text-left text-sm font-medium text-gray-700 w-20">Amount</th>
                <th className="p-3 text-left text-sm font-medium text-gray-700 w-16">Currency</th>
                <th className="p-3 text-left text-sm font-medium text-gray-700 w-20">Coupon</th>
                <th className="p-3 text-left text-sm font-medium text-gray-700 w-20">Plan</th>
                {/* <th className="p-3 text-left text-sm font-medium text-gray-700 w-24">Action</th> */}
              </tr>
            </thead>
            <tbody>
              {getCurrentPageItems().map((transaction) => (
                <tr key={transaction.paymentId} className="border-b hover:bg-gray-50">
                  <td className="p-3 text-sm">
                    <div className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                      {transaction.paymentId}
                    </div>
                  </td>
                  <td className="p-3 text-sm font-medium">{transaction.paidBy}</td>
                  <td className="p-3 text-sm text-gray-600">
                    {formatDateTime(transaction.dateTime)}
                  </td>
                  <td className="p-3 text-sm">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {transaction.modeOfPayment}
                    </span>
                  </td>
                  <td className="p-3 text-sm font-semibold text-green-600">
                    ₹{transaction.amount?.toLocaleString()}
                  </td>
                  <td className="p-3 text-sm text-gray-500">{transaction.currency}</td>
                  <td className="p-3 text-sm">
                    {transaction.coupon ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {transaction.coupon}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="p-3 text-sm">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {transaction.plan}
                    </span>
                  </td>
                  {/* <td className="p-3 text-sm">
                    <button className="text-blue-600 hover:text-blue-800 hover:underline text-xs font-medium">
                      Download
                    </button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 flex justify-center items-center gap-2">
          <button 
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className={`px-3 py-1 text-gray-600 border border-gray-300 rounded-md hover:text-purple-600 flex items-center gap-1 ${
              currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </button>
          
          {getPageNumbers().map((pageNum, index) => (
            pageNum === '...' ? (
              <span key={`dots-${index}`} className="px-2">...</span>
            ) : (
              <button 
                key={pageNum}
                onClick={() => handlePageChange(pageNum as number)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === pageNum 
                    ? 'bg-purple-600 text-white' 
                    : 'hover:bg-gray-100'
                }`}
              >
                {pageNum}
              </button>
            )
          ))}
          
          <button 
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 text-gray-600 border border-gray-300 rounded-md hover:text-purple-600 flex items-center gap-1 ${
              currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Next <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionsTable; 