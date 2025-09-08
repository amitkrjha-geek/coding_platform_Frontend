"use client";

import { useState, useMemo } from "react";
import { downloadInvoiceAsPDF as getInvoiceData } from "@/API/payment";
import { downloadInvoiceAsFile, InvoiceData } from "@/utils/pdfGenerator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Download, 
  Search, 
  Filter, 
  FileText, 
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { formatDateForDisplay } from "@/utils";

interface PaymentHistoryProps {
  paymentHistory: any[];
  loading?: boolean;
  error?: string;
}

const PaymentHistory = ({ paymentHistory, loading = false, error }: PaymentHistoryProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [downloadingInvoices, setDownloadingInvoices] = useState<Set<string>>(new Set());
  const itemsPerPage = 10;


  // Filter and search payments
  const filteredPayments = useMemo(() => {
    if (!paymentHistory) return [];
    
    return paymentHistory.filter((payment) => {
      const matchesSearch = 
        payment.txnId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.planId?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [paymentHistory, searchTerm, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPayments = filteredPayments.slice(startIndex, startIndex + itemsPerPage);

  // Status badge styling
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      success: { 
        color: "bg-emerald-50 text-emerald-700 border-emerald-200", 
        icon: CheckCircle,
        dotColor: "bg-emerald-500"
      },
      failed: { 
        color: "bg-red-50 text-red-700 border-red-200", 
        icon: XCircle,
        dotColor: "bg-red-500"
      },
      pending: { 
        color: "bg-amber-50 text-amber-700 border-amber-200", 
        icon: Clock,
        dotColor: "bg-amber-500"
      },
      cancelled: { 
        color: "bg-gray-50 text-gray-700 border-gray-200", 
        icon: AlertCircle,
        dotColor: "bg-gray-500"
      },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${config.color}`}>
        <div className={`w-2 h-2 rounded-full ${config.dotColor}`}></div>
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </div>
    );
  };

  // Download single invoice
  const handleDownloadInvoice = async (txnId: string) => {
    try {
      setDownloadingInvoices(prev => new Set(prev).add(txnId));
      
      const response = await getInvoiceData(txnId);
      const invoiceData: InvoiceData = response.data;
      
      // Download as HTML file (can be printed as PDF)
      downloadInvoiceAsFile(invoiceData, 'html');
      
    } catch (error) {
      console.error('Error downloading invoice:', error);
      alert('Failed to download invoice. Please try again.');
    } finally {
      setDownloadingInvoices(prev => {
        const newSet = new Set(prev);
        newSet.delete(txnId);
        return newSet;
      });
    }
  };


  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12 text-red-600">
            <AlertCircle className="w-6 h-6 mr-2" />
            {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-6 py-6 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Payment History</h2>
              <p className="text-sm text-gray-600 mt-1">Track and manage your payment transactions</p>
            </div>
          </div>
          
          {paymentHistory && (
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 bg-white rounded-full border border-gray-200">
                <span className="text-sm font-medium text-gray-700">
                  {paymentHistory.length} {paymentHistory.length === 1 ? 'Payment' : 'Payments'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search by transaction ID, name, email, or plan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 h-11 bg-white border-gray-200 focus:border-purple-300 focus:ring-purple-200"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full lg:w-56 h-11 bg-white border-gray-200 focus:border-purple-300 focus:ring-purple-200">
              <Filter className="w-4 h-4 mr-2 text-gray-500" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Payment Table */}
      <div className="px-6 py-6">
        {filteredPayments.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No payments found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {searchTerm || statusFilter !== "all" 
                ? "Try adjusting your search or filter criteria to find what you're looking for." 
                : "You haven't made any payments yet. Your payment history will appear here once you make your first transaction."}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Transaction ID
                      </th>
                      <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap min-w-[140px]">
                        Date & Time
                      </th>
                      <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Customer
                  </th>
                      <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Plan
                  </th>
                      <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Amount
                  </th>
                      <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Payment Mode
                      </th>
                      <th className="text-right py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedPayments.map((payment: any, index: number) => (
                      <tr key={payment.txnId} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                        <td className="py-5 px-6">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                              <FileText className="w-4 h-4 text-purple-600" />
                            </div>
                            <div className="text-sm font-mono text-gray-900 font-medium">
                              {payment.txnId}
                            </div>
                          </div>
                        </td>
                        <td className="py-5 px-6">
                          {(() => {
                            const dateInfo = formatDateForDisplay(payment.paymentCompletedAt || payment.paymentInitiatedAt);
                            return (
                              <div className="text-sm text-gray-900">
                                <div className="font-medium whitespace-nowrap">
                                  {dateInfo.date}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {dateInfo.year}
                                </div>
                              </div>
                            );
                          })()}
                        </td>
                        <td className="py-5 px-6">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-xs font-medium text-blue-600">
                                {payment.customerName?.charAt(0)?.toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {payment.customerName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {payment.customerEmail}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-5 px-6">
                          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {payment.planId?.name || 'N/A'}
                          </div>
                        </td>
                        <td className="py-5 px-6">
                          <div className="text-sm">
                            <div className="font-semibold text-gray-900 text-lg">
                              ₹{payment.amount?.toLocaleString()}
                            </div>
                            {payment.realAmount && payment.realAmount !== payment.amount && (
                              <div className="text-xs text-gray-500 line-through">
                                Original: ₹{payment.realAmount?.toLocaleString()}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-5 px-6">
                          {getStatusBadge(payment.status)}
                        </td>
                        <td className="py-5 px-6">
                          <div className="flex items-center gap-2 text-sm text-gray-900">
                            <div className="p-1 bg-gray-100 rounded">
                              <CreditCard className="w-4 h-4 text-gray-600" />
                            </div>
                            <span className="font-medium">{payment.paymentMode || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="py-5 px-6 text-right">
                          <Button
                            onClick={() => handleDownloadInvoice(payment.txnId)}
                            disabled={downloadingInvoices.has(payment.txnId)}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            {downloadingInvoices.has(payment.txnId) ? 'Downloading...' : 'Download'}
                          </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Showing <span className="font-medium text-gray-900">{startIndex + 1}</span> to{' '}
                  <span className="font-medium text-gray-900">{Math.min(startIndex + itemsPerPage, filteredPayments.length)}</span> of{' '}
                  <span className="font-medium text-gray-900">{filteredPayments.length}</span> payments
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <Button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 text-sm font-medium rounded-lg transition-colors duration-150 ${
                          currentPage === page
                            ? 'bg-purple-600 text-white'
                            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;