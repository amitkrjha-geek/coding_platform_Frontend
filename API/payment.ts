import axiosInstance from "@/config/api";

export interface PaymentData {
  amount: number;
  product: string;
  firstname: string;
  email: string;
  mobile: string;
  userId?: string;
  planId?: string;
  couponId?: string;
  realAmount?: number;
  challengeId?: string;
}



export const getPayment = async (paymentData: PaymentData) => {
  try {
    const response = await axiosInstance.post("/get-payment", paymentData);
    console.log("payment response",response.data);
    return response.data;
  } catch (error: any) {
    throw {
      success: false,
      message: error.response?.data?.message || "Payment initialization failed",
      error: error.response?.data || error
    };
  }
};

// Get user payment history
export const getUserPaymentHistory = async (userId: string, status?: string) => {
  try {
    const params = new URLSearchParams();
    if (status) params.append('status', status);

    const response = await axiosInstance.get(`/payments/history/${userId}?${params}`);
    return response.data;
  } catch (error: any) {
    throw {
      success: false,
      message: error.response?.data?.message || "Failed to fetch payment history",
      error: error.response?.data || error
    };
  }
};

// Get all payments (admin)
export const getAllPayments = async (status?: string, userId?: string) => {
  try {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (userId) params.append('userId', userId);

    const response = await axiosInstance.get(`/payments/admin/all?${params}`);
    return response.data;
  } catch (error: any) {
    throw {
      success: false,
      message: error.response?.data?.message || "Failed to fetch payments",
      error: error.response?.data || error
    };
  }
};

// Get payment statistics (admin)
export const getPaymentStats = async () => {
  try {
    const response = await axiosInstance.get("/payments/admin/stats");
    return response.data;
  } catch (error: any) {
    throw {
      success: false,
      message: error.response?.data?.message || "Failed to fetch payment statistics",
      error: error.response?.data || error
    };
  }
};

// Download invoice for a payment
export const downloadInvoice = async (txnId: string) => {
  try {
    const response = await axiosInstance.get(`/payments/invoice/${txnId}`, {
      responseType: 'blob' // Important for file downloads
    });
    return response.data;
  } catch (error: any) {
    throw {
      success: false,
      message: error.response?.data?.message || "Failed to download invoice",
      error: error.response?.data || error
    };
  }
};

// Download invoice as PDF (alternative method)
export const downloadInvoiceAsPDF = async (txnId: string) => {
  try {
    const response = await axiosInstance.get(`/payments/invoice/${txnId}`);
    return response.data;
  } catch (error: any) {
    throw {
      success: false,
      message: error.response?.data?.message || "Failed to fetch invoice data",
      error: error.response?.data || error
    };
  }
};