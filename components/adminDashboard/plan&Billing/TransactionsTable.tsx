import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Transaction } from '@/types';

interface TransactionsTableProps {
  transactions: Transaction[];
}

const TransactionsTable = ({ transactions }: TransactionsTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.paymentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.paidBy.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Calculate total pages
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  // Get current page transactions
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredTransactions.slice(startIndex, endIndex);
  };

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

  return (
    <div className="mt-4">
      <div className="flex gap-4 mb-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Enter Name or Payment ID"
            className="w-full p-2 pl-3 pr-10 border-2 rounded-md border-purple focus:border-purple focus:outline-none focus:ring-0" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={20} />
          </div>
        </div>
        <select
          className="p-2 border-2 rounded-md border-purple focus:border-purple focus:outline-none focus:ring-0" 
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="subscription">Subscription</option>
          <option value="onetime">One-time</option>
        </select>
        <select
          className="p-2 border-2 rounded-md border-purple focus:border-purple focus:outline-none focus:ring-0" 
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="all">Sort by</option>
          <option value="date">Date</option>
          <option value="amount">Amount</option>
        </select>
      </div>

      <h3 className="font-manrope font-semibold text-base leading-[21.86px] text-purple mb-4">Payment History</h3>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-[#7421931A]">
              <th className="p-4 text-left">Payment ID</th>
              <th className="p-4 text-left">Paid By</th>
              <th className="p-4 text-left">Date and Time</th>
              <th className="p-4 text-left">Mode of Payment</th>
              <th className="p-4 text-left">Amount</th>
              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {getCurrentPageItems().map((transaction) => (
              <tr key={transaction.paymentId} className="border-b">
                <td className="p-4">{transaction.paymentId}</td>
                <td className="p-4">{transaction.paidBy}</td>
                <td className="p-4">{transaction.dateTime}</td>
                <td className="p-4">{transaction.modeOfPayment}</td>
                <td className="p-4">₹ {transaction.amount}</td>
                <td className="p-4">
                  <button className="text-blue-600 hover:underline">
                    Download Invoice
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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