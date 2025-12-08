import { toast } from "react-hot-toast";

const CLOUDINARY_UPLOAD_URL = import.meta.env.VITE_CLOUDINARY_UPLOAD_URL;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

interface CloudinaryResponse {
  secure_url: string;
  [key: string]: any;
}

/**
 * Uploads a file to Cloudinary
 * @param file - The file to upload
 * @returns Promise that resolves to the uploaded image URL
 * @throws Error if upload fails
 */
export const uploadToCloudinary = async (file: File): Promise<string> => {
  if (!file.type.startsWith("image/")) {
    toast.error("Please upload an image file");
    throw new Error("Invalid file type");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const response = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to upload image");
    }

    const data: CloudinaryResponse = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to upload image"
    );
  }
};

/**
 * Creates a data URL for image preview
 * @param file - The file to create a preview for
 * @returns Promise that resolves to the data URL
 */
export const createImagePreview = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Validates a file before upload
 * @param file - The file to validate
 * @param options - Validation options
 * @returns true if file is valid
 * @throws Error if validation fails
 */
export const validateFile = (
  file: File,
  options: { allowedTypes?: string[] } = {}
): boolean => {
  const {
    allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"],
  } = options;

  if (!allowedTypes.includes(file.type)) {
    throw new Error(
      "Invalid file type. Please upload an image (JPEG, PNG, JPG, or WebP)."
    );
  }

  return true;
};
