import axiosInstance from "@/config/api";

export interface PaymentData {
  amount: number;
  product: string;
  firstname: string;
  email: string;
  mobile: string;
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