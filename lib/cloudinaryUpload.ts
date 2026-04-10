export interface CloudinaryUploadResult {
  success: boolean;
  url?: string;
  publicId?: string;
  error?: string;
}

/**
 * Upload a PDF file to Cloudinary using unsigned upload preset.
 * Uses the "raw" resource type for non-image files like PDFs.
 */
export const uploadPdfToCloudinary = async (
  file: File,
  folder: string = "challenges/answer-files"
): Promise<CloudinaryUploadResult> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "givinity_unsigned"
    );
    formData.append("folder", folder);

    // Use "raw" resource type for PDFs (not "image")
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.error?.message || `Upload failed: ${response.statusText}`
      );
    }

    const data = await response.json();

    return {
      success: true,
      url: data.secure_url,
      publicId: data.public_id,
    };
  } catch (error) {
    console.error("Cloudinary PDF upload error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
};
