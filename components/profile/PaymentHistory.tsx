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
        color: "bg-neon/10 text-neon border-neon/30",
        icon: CheckCircle,
        dotColor: "bg-neon"
      },
      failed: {
        color: "bg-danger/10 text-danger border-danger/30",
        icon: XCircle,
        dotColor: "bg-danger"
      },
      pending: {
        color: "bg-warn/10 text-warn border-warn/30",
        icon: Clock,
        dotColor: "bg-warn"
      },
      cancelled: {
        color: "bg-htb-panel-2 text-htb-muted border-htb-border",
        icon: AlertCircle,
        dotColor: "bg-htb-text-dim"
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-mono text-[10px] uppercase tracking-widest font-semibold border ${config.color}`}>
        <div className={`w-1 h-1 rounded-full ${config.dotColor}`}></div>
        <Icon className="w-3 h-3" />
        {status}
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
          <CardTitle className="flex items-center gap-2 text-htb-text">
            <FileText className="w-5 h-5 text-neon" />
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-htb-text">
            <FileText className="w-5 h-5 text-neon" />
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12 text-danger">
            <AlertCircle className="w-6 h-6 mr-2" />
            {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="panel overflow-hidden">
      {/* Header */}
      <div className="px-5 sm:px-6 py-5 border-b border-htb-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-md border border-neon/30 bg-neon/10">
              <FileText className="w-5 h-5 text-neon" />
            </div>
            <div>
              <span className="terminal-eyebrow">payments.history</span>
              <h2 className="text-xl font-bold text-htb-text mt-0.5">
                Transactions
              </h2>
            </div>
          </div>

          {paymentHistory && (
            <div className="inline-flex items-center px-2.5 py-1 rounded-md border border-htb-border bg-htb-bg/40 font-mono text-[11px] uppercase tracking-widest font-semibold text-htb-muted">
              {paymentHistory.length} {paymentHistory.length === 1 ? 'Payment' : 'Payments'}
            </div>
          )}
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="px-5 sm:px-6 py-4 border-b border-htb-border bg-htb-bg/30">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-htb-text-dim w-4 h-4 pointer-events-none" />
            <Input
              placeholder="Search by transaction ID, name, email, or plan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 font-mono text-sm"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full lg:w-56 h-10 font-mono text-xs uppercase tracking-wider">
              <Filter className="w-3.5 h-3.5 mr-2 text-htb-text-dim" />
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
      <div className="px-5 sm:px-6 py-5">
        {filteredPayments.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-md border border-htb-border bg-htb-bg/40 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-7 h-7 text-htb-text-dim" />
            </div>
            <span className="terminal-eyebrow inline-flex justify-center mb-2">no_payments</span>
            <h3 className="text-lg font-semibold text-htb-text mb-1">
              No payments found
            </h3>
            <p className="text-sm text-htb-muted max-w-md mx-auto">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Your payment history will appear here once you make your first transaction."}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-hidden rounded-md border border-htb-border">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-htb-bg/40">
                    <tr>
                      <th className="text-left py-3 px-4 text-[10px] font-mono font-semibold text-htb-muted uppercase tracking-widest">
                        Transaction ID
                      </th>
                      <th className="text-left py-3 px-4 text-[10px] font-mono font-semibold text-htb-muted uppercase tracking-widest whitespace-nowrap min-w-[140px]">
                        Date
                      </th>
                      <th className="text-left py-3 px-4 text-[10px] font-mono font-semibold text-htb-muted uppercase tracking-widest">
                        Customer
                      </th>
                      <th className="text-left py-3 px-4 text-[10px] font-mono font-semibold text-htb-muted uppercase tracking-widest">
                        Plan
                      </th>
                      <th className="text-left py-3 px-4 text-[10px] font-mono font-semibold text-htb-muted uppercase tracking-widest">
                        Amount
                      </th>
                      <th className="text-left py-3 px-4 text-[10px] font-mono font-semibold text-htb-muted uppercase tracking-widest">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-[10px] font-mono font-semibold text-htb-muted uppercase tracking-widest">
                        Mode
                      </th>
                      <th className="text-right py-3 px-4 text-[10px] font-mono font-semibold text-htb-muted uppercase tracking-widest">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedPayments.map((payment: any) => (
                      <tr
                        key={payment.txnId}
                        className="border-t border-htb-border hover:bg-neon/5 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="flex-shrink-0 w-7 h-7 rounded border border-neon/30 bg-neon/10 flex items-center justify-center">
                              <FileText className="w-3.5 h-3.5 text-neon" />
                            </div>
                            <div className="font-mono text-xs text-htb-text">
                              {payment.txnId}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          {(() => {
                            const dateInfo = formatDateForDisplay(payment.paymentCompletedAt || payment.paymentInitiatedAt);
                            return (
                              <div className="text-sm text-htb-text">
                                <div className="font-mono whitespace-nowrap">
                                  {dateInfo.date}
                                </div>
                                <div className="text-[10px] text-htb-text-dim font-mono mt-0.5">
                                  {dateInfo.year}
                                </div>
                              </div>
                            );
                          })()}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="flex-shrink-0 w-7 h-7 rounded-full border border-neon/30 bg-neon/10 flex items-center justify-center">
                              <span className="text-xs font-mono font-semibold text-neon">
                                {payment.customerName?.charAt(0)?.toUpperCase()}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-htb-text truncate">
                                {payment.customerName}
                              </div>
                              <div className="text-xs text-htb-text-dim truncate">
                                {payment.customerEmail}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="inline-flex items-center px-2 py-0.5 rounded border border-sky-400/30 bg-sky-400/10 font-mono text-[10px] font-semibold uppercase tracking-widest text-sky-300">
                            {payment.planId?.name || 'N/A'}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <div className="font-mono font-bold text-htb-text tabular-nums">
                              ₹{payment.amount?.toLocaleString()}
                            </div>
                            {payment.realAmount && payment.realAmount !== payment.amount && (
                              <div className="text-[10px] font-mono text-htb-text-dim line-through">
                                ₹{payment.realAmount?.toLocaleString()}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          {getStatusBadge(payment.status)}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2 text-sm">
                            <div className="p-1 rounded border border-htb-border bg-htb-bg/40">
                              <CreditCard className="w-3.5 h-3.5 text-htb-muted" />
                            </div>
                            <span className="text-htb-text font-mono text-xs">{payment.paymentMode || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <Button
                            variant="ghost-neon"
                            size="sm"
                            onClick={() => handleDownloadInvoice(payment.txnId)}
                            disabled={downloadingInvoices.has(payment.txnId)}
                            className="font-mono text-[11px] uppercase tracking-widest"
                          >
                            <Download className="w-3.5 h-3.5 mr-1.5" />
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
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-6 pt-5 border-t border-htb-border">
                <div className="text-xs font-mono uppercase tracking-wider text-htb-text-dim">
                  Showing <span className="text-htb-text">{startIndex + 1}</span> – <span className="text-htb-text">{Math.min(startIndex + itemsPerPage, filteredPayments.length)}</span> of <span className="text-htb-text">{filteredPayments.length}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline-dim"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="font-mono text-[11px] uppercase tracking-widest"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 mr-1" />
                    Prev
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-9 h-9 text-xs font-mono font-semibold rounded-md transition-colors ${
                          currentPage === page
                            ? 'bg-neon text-white shadow-neon-sm'
                            : 'border border-htb-border bg-htb-panel text-htb-muted hover:border-neon/40 hover:text-neon'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  <Button
                    variant="outline-dim"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="font-mono text-[11px] uppercase tracking-widest"
                  >
                    Next
                    <ChevronRight className="w-3.5 h-3.5 ml-1" />
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