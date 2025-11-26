import imageCompression from 'browser-image-compression';
import toast from 'react-hot-toast';

/**
 * Options for image compression
 */
export interface CompressionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  useWebWorker?: boolean;
  quality?: number;
}

/**
 * Default compression options
 */
const DEFAULT_OPTIONS: CompressionOptions = {
  maxSizeMB: 1, // Max 1MB
  maxWidthOrHeight: 1920, // Max dimension
  useWebWorker: true,
  quality: 0.8, // 80% quality
};

/**
 * Compresses a single image file
 * @param file - The image file to compress
 * @param options - Compression options
 * @returns Compressed file
 */
export const compressImage = async (
  file: File,
  options: CompressionOptions = {}
): Promise<File> => {
  const finalOptions = { ...DEFAULT_OPTIONS, ...options };

  try {
    const originalSizeMB = file.size / 1024 / 1024;
    
    // Skip compression if file is already small
    if (originalSizeMB < 0.5) {
      console.log(`File ${file.name} is already small (${originalSizeMB.toFixed(2)}MB), skipping compression`);
      return file;
    }

    const compressedFile = await imageCompression(file, finalOptions);
    const compressedSizeMB = compressedFile.size / 1024 / 1024;
    
    console.log(`Compressed ${file.name}:`);
    console.log(`  Original: ${originalSizeMB.toFixed(2)}MB`);
    console.log(`  Compressed: ${compressedSizeMB.toFixed(2)}MB`);
    console.log(`  Reduction: ${((1 - compressedSizeMB / originalSizeMB) * 100).toFixed(1)}%`);
    
    return compressedFile;
  } catch (error) {
    console.error('Compression failed:', error);
    toast.error('Image compression failed, uploading original');
    return file; // Return original if compression fails
  }
};

/**
 * Compresses multiple images with progress callback
 * @param files - Array of image files to compress
 * @param options - Compression options
 * @param onProgress - Progress callback (current, total)
 * @returns Array of compressed files
 */
export const compressMultipleImages = async (
  files: File[],
  options: CompressionOptions = {},
  onProgress?: (current: number, total: number) => void
): Promise<File[]> => {
  const compressed: File[] = [];
  
  for (let i = 0; i < files.length; i++) {
    const compressedFile = await compressImage(files[i], options);
    compressed.push(compressedFile);
    
    if (onProgress) {
      onProgress(i + 1, files.length);
    }
  }
  
  return compressed;
};

/**
 * Estimates compression time based on file size
 * @param fileSizeMB - File size in megabytes
 * @returns Estimated time in seconds
 */
export const estimateCompressionTime = (fileSizeMB: number): number => {
  // Rough estimate: ~0.5s per MB
  return Math.ceil(fileSizeMB * 0.5);
};

/**
 * Validates if a file is an image
 * @param file - File to validate
 * @returns True if file is an image
 */
export const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/');
};

/**
 * Gets human-readable file size
 * @param bytes - File size in bytes
 * @returns Formatted file size string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
};
