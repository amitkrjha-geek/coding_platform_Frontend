// Simple PDF generation utility
// In a real application, you would use libraries like jsPDF, Puppeteer, or similar

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  customer: {
    name: string;
    email: string;
    mobile: string;
  };
  plan: {
    name: string;
    price: number;
    priceMode: string;
  };
  coupon?: {
    code: string;
    discountAmount: number;
  };
  amount: number;
  realAmount?: number;
  status: string;
  paymentMode: string;
  txnId: string;
  gatewayTransactionId?: string;
}

export const generateInvoiceHTML = (data: InvoiceData): string => {
  const discount = data.realAmount && data.realAmount !== data.amount 
    ? data.realAmount - data.amount 
    : 0;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice ${data.invoiceNumber}</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
                background-color: #f5f5f5;
            }
            .invoice-container {
                max-width: 800px;
                margin: 0 auto;
                background: white;
                padding: 30px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 2px solid #6366f1;
                padding-bottom: 20px;
                margin-bottom: 30px;
            }
            .logo {
                font-size: 24px;
                font-weight: bold;
                color: #6366f1;
            }
            .invoice-title {
                text-align: right;
            }
            .invoice-number {
                font-size: 18px;
                font-weight: bold;
                color: #374151;
            }
            .invoice-date {
                color: #6b7280;
                margin-top: 5px;
            }
            .customer-info {
                margin-bottom: 30px;
            }
            .section-title {
                font-size: 16px;
                font-weight: bold;
                color: #374151;
                margin-bottom: 10px;
            }
            .customer-details {
                background: #f9fafb;
                padding: 15px;
                border-radius: 6px;
            }
            .customer-details p {
                margin: 5px 0;
                color: #374151;
            }
            .items-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
            }
            .items-table th,
            .items-table td {
                padding: 12px;
                text-align: left;
                border-bottom: 1px solid #e5e7eb;
            }
            .items-table th {
                background: #f9fafb;
                font-weight: bold;
                color: #374151;
            }
            .total-section {
                text-align: right;
                margin-top: 20px;
            }
            .total-row {
                display: flex;
                justify-content: space-between;
                padding: 8px 0;
                border-bottom: 1px solid #e5e7eb;
            }
            .total-row.final {
                font-weight: bold;
                font-size: 18px;
                color: #374151;
                border-top: 2px solid #6366f1;
                margin-top: 10px;
                padding-top: 15px;
            }
            .status-badge {
                display: inline-block;
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: bold;
                text-transform: uppercase;
            }
            .status-success {
                background: #dcfce7;
                color: #166534;
            }
            .status-failed {
                background: #fef2f2;
                color: #dc2626;
            }
            .status-pending {
                background: #fef3c7;
                color: #d97706;
            }
            .status-cancelled {
                background: #f3f4f6;
                color: #6b7280;
            }
            .footer {
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
                text-align: center;
                color: #6b7280;
                font-size: 14px;
            }
        </style>
    </head>
    <body>
        <div class="invoice-container">
            <div class="header">
                <div class="logo">Coding Platform</div>
                <div class="invoice-title">
                    <div class="invoice-number">${data.invoiceNumber}</div>
                    <div class="invoice-date">${new Date(data.date).toLocaleDateString()}</div>
                </div>
            </div>

            <div class="customer-info">
                <div class="section-title">Bill To:</div>
                <div class="customer-details">
                    <p><strong>${data.customer.name}</strong></p>
                    <p>${data.customer.email}</p>
                    <!-- <p>${data.customer.mobile}</p> -->
                </div>
            </div>

            <table class="items-table">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Plan</th>
                        <th>Price Mode</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${data.plan.name} Subscription</td>
                        <td>${data.plan.name}</td>
                        <td>${data.plan.priceMode}</td>
                        <td>₹${data.realAmount || data.amount}</td>
                    </tr>
                    ${discount > 0 ? `
                    <tr>
                        <td colspan="3">Discount (${data.coupon?.code || 'Applied'})</td>
                        <td>-₹${discount}</td>
                    </tr>
                    ` : ''}
                </tbody>
            </table>

            <div class="total-section">
                ${discount > 0 ? `
                <div class="total-row">
                    <span>Subtotal:</span>
                    <span>₹${data.realAmount}</span>
                </div>
                <div class="total-row">
                    <span>Discount:</span>
                    <span>-₹${discount}</span>
                </div>
                ` : ''}
                <div class="total-row final">
                    <span>Total:</span>
                    <span>₹${data.amount}</span>
                </div>
            </div>

            <div style="margin-top: 30px;">
                <div class="section-title">Payment Information:</div>
                <div class="customer-details">
                    <p><strong>Transaction ID:</strong> ${data.txnId}</p>
                    <p><strong>Payment Mode:</strong> ${data.paymentMode || 'N/A'}</p>
                    ${data.gatewayTransactionId ? `<p><strong>Gateway Transaction ID:</strong> ${data.gatewayTransactionId}</p>` : ''}
                    <p><strong>Status:</strong> 
                        <span class="status-badge status-${data.status}">${data.status}</span>
                    </p>
                </div>
            </div>

            <div class="footer">
                <p>Thank you for your business!</p>
                <p>This is a computer-generated invoice and does not require a signature.</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

export const downloadInvoiceAsPDF = async (data: InvoiceData): Promise<void> => {
  const html = generateInvoiceHTML(data);
  
  // Create a new window with the HTML content
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    throw new Error('Unable to open print window. Please check your popup blocker settings.');
  }
  
  printWindow.document.write(html);
  printWindow.document.close();
  
  // Wait for the content to load, then trigger print
  printWindow.onload = () => {
    printWindow.print();
  };
};

export const downloadInvoiceAsFile = (data: InvoiceData, format: 'html' | 'json' = 'html'): void => {
  let content: string;
  let filename: string;
  let mimeType: string;
  
  if (format === 'html') {
    content = generateInvoiceHTML(data);
    filename = `invoice-${data.invoiceNumber}.html`;
    mimeType = 'text/html';
  } else {
    content = JSON.stringify(data, null, 2);
    filename = `invoice-${data.invoiceNumber}.json`;
    mimeType = 'application/json';
  }
  
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
