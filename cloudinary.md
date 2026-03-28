//env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=deuirukrz
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=givinity_unsigned 
 
 <div>
              <label className="text-sm font-medium">Cover Image</label>
              <CloudinaryImageUpload
                value={formData.coverImageUrl}
                onChange={(value) => handleInputChange('coverImageUrl', value)}
                folder="blogs"
                placeholder="Upload cover image"
                maxWidth={1200}
                maxHeight={600}
              />
            </div>



            'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { CloudinaryImageProps } from '@/types/cloudinary';
import { uploadToCloudinary } from '@/lib/utils/cloudinaryUtils';

const CloudinaryImageUpload = ({
  value,
  onChange,
  folder,
  userId,
  isError = false,
  placeholder = 'Select an image',
  required = false,
  className = '',
  maxWidth = 1200,
  maxHeight = 800,
  quality = 'auto',
  format = 'auto',
  crop = 'limit',
  gravity = 'center',
}: CloudinaryImageProps) => {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size must be less than 10MB');
      return;
    }

    setUploading(true);

    try {
      const result = await uploadToCloudinary(
        file,
        {
          folder,
          maxWidth,
          maxHeight,
          quality,
          format,
          crop,
          gravity,
        },
        userId
      );

      if (result.success && result.url) {
        onChange(result.url);
        setPreview(result.url);
        toast.success('Image uploaded successfully');
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    onChange('');
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleManualUrlChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const url = event.target.value;
    onChange(url);
    setPreview(url);
  };

  return (
    <div className={`space-y-4 w-full ${className}`}>
      {/* Image Preview */}
      {preview && (
        <div className="relative w-full h-48 border rounded-lg overflow-hidden">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={handleRemoveImage}
            disabled={uploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Upload Button */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="flex-1"
          disabled={uploading}
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              {preview ? 'Change Image' : 'Upload Image'}
            </>
          )}
        </Button>
        {preview && !uploading && (
          <Button type="button" variant="outline" onClick={handleRemoveImage}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* No image placeholder */}
      {!preview && !uploading && (
        <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500">
          <ImageIcon className="h-12 w-12 mb-2" />
          <p className="text-sm">No image selected</p>
        </div>
      )}

      {/* Uploading placeholder */}
      {uploading && (
        <div className="w-full h-48 border-2 border-dashed border-blue-300 rounded-lg flex flex-col items-center justify-center text-blue-500">
          <Loader2 className="h-12 w-12 mb-2 animate-spin" />
          <p className="text-sm">Uploading image...</p>
        </div>
      )}
    </div>
  );
};

export default CloudinaryImageUpload;



// Cloudinary upload utilities and folder organization

export type CloudinaryFolder =
  | 'profiles'
  | 'blogs'
  | 'fundraisers'
  | 'prayers'
  | 'volunteers'
  | 'counseling'
  | 'preset-donations'
  | 'blood-donations'
  | 'medical-requests'
  | 'general';

export interface CloudinaryUploadOptions {
  folder: CloudinaryFolder;
  maxWidth?: number;
  maxHeight?: number;
  quality?: 'auto' | number;
  format?: 'auto' | 'webp' | 'jpg' | 'png';
  crop?: 'fill' | 'fit' | 'limit' | 'scale' | 'crop';
  gravity?: 'face' | 'center' | 'auto' | 'north' | 'south' | 'east' | 'west';
}

export interface CloudinaryUploadResult {
  success: boolean;
  url?: string;
  publicId?: string;
  error?: string;
}

/**
 * Generate folder path for Cloudinary uploads
 */
export const getCloudinaryFolderPath = (
  folder: CloudinaryFolder,
  userId?: string
): string => {
  const basePath = `givinity/${folder}`;

  // For user-specific folders, include user ID
  if (userId && (folder === 'profiles' || folder === 'prayers')) {
    return `${basePath}/${userId}`;
  }

  return basePath;
};

/**
 * Generate transformation string for Cloudinary
 */
export const generateTransformationString = (
  options: CloudinaryUploadOptions
): string => {
  const { maxWidth, maxHeight, quality, format, crop, gravity } = options;

  const transformations = [];

  if (maxWidth) transformations.push(`w_${maxWidth}`);
  if (maxHeight) transformations.push(`h_${maxHeight}`);
  if (crop) transformations.push(`c_${crop}`);
  if (gravity) transformations.push(`g_${gravity}`);
  if (quality) transformations.push(`q_${quality}`);
  if (format) transformations.push(`f_${format}`);

  return transformations.join(',');
};

/**
 * Upload file to Cloudinary with proper folder organization
 */
export const uploadToCloudinary = async (
  file: File,
  options: CloudinaryUploadOptions,
  userId?: string
): Promise<CloudinaryUploadResult> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append(
      'upload_preset',
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'givinity_unsigned'
    );
    formData.append(
      'cloud_name',
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || ''
    );

    // Add folder path
    const folderPath = getCloudinaryFolderPath(options.folder, userId);
    formData.append('folder', folderPath);

    // Simple upload without transformations - optimizations can be added later

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      success: true,
      url: data.secure_url,
      publicId: data.public_id,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
};

/**
 * Delete image from Cloudinary
 */
export const deleteFromCloudinary = async (
  publicId: string
): Promise<boolean> => {
  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/destroy`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          public_id: publicId,
          upload_preset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
        }),
      }
    );

    return response.ok;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return false;
  }
};

/**
 * Extract public ID from Cloudinary URL
 */
export const extractPublicId = (url: string): string | null => {
  const match = url.match(/\/v\d+\/(.+)\.(jpg|jpeg|png|gif|webp)$/);
  return match ? match[1] : null;
};

/**
 * Get optimized image URL with transformations
 */
export const getOptimizedImageUrl = (
  url: string,
  width?: number,
  height?: number,
  quality?: 'auto' | number
): string => {
  if (!url.includes('cloudinary.com')) return url;

  const transformations = [];
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (quality) transformations.push(`q_${quality}`);

  if (transformations.length === 0) return url;

  const baseUrl = url.split('/upload/')[0];
  const path = url.split('/upload/')[1];

  return `${baseUrl}/upload/${transformations.join(',')}/${path}`;
};
