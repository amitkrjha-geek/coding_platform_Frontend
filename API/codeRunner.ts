import axiosInstance from "@/config/api";

// challengeId, code, language

export const storeCode = async (codeData: any) => {
    try {
      const response = await axiosInstance.post("/code-runner/store", codeData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.error || "Registration failed";
    }
  };
  
  export const triggerSubmission = async (submissionId: string) => {
    try {
      const response = await axiosInstance.post("/code-runner/submit", submissionId);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || "Submission failed";
    }
  };
  