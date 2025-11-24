import { useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import {
  uploadToCloudinary,
  createImagePreview,
  validateFile,
} from "../utils/upload";

interface UseImageUploadOptions {
  allowedTypes?: string[];
  onSuccess?: (url: string) => void;
  onError?: (error: Error) => void;
}

export const useImageUpload = (options: UseImageUploadOptions = {}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setImagePreview(null);
    setError(null);
  }, []);

  const handleFileSelect = useCallback(
    async (file: File | null): Promise<string | null> => {
      if (!file) return null;

      try {
        setIsUploading(true);
        setError(null);

        // Validate file
        validateFile(file, {
          allowedTypes: options.allowedTypes,
        });

        // Create preview
        const preview = await createImagePreview(file);
        setImagePreview(preview);

        // Upload to Cloudinary
        const imageUrl = await uploadToCloudinary(file);

        // Call success handler if provided
        if (options.onSuccess) {
          options.onSuccess(imageUrl);
        }

        return imageUrl;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Failed to process image");
        console.error("Image upload error:", error);

        // Set error state
        setError(error.message);

        // Call error handler if provided
        if (options.onError) {
          options.onError(error);
        } else {
          // Default error toast
          toast.error(error.message);
        }

        // Reset preview on error
        setImagePreview(null);
        return null;
      } finally {
        setIsUploading(false);
      }
    },
    [options]
  );

  return {
    isUploading,
    imagePreview,
    error,
    handleFileSelect,
    reset,
    setImagePreview, // Allow external control if needed
  };
};

export default useImageUpload;
