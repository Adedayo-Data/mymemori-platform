/**
 * Cloudinary Image Optimization Utility
 * 
 * Optimizes Cloudinary URLs for better performance on slow connections.
 * All transformations are FREE and don't count against storage quota.
 */

export type ImageContext = 'thumbnail' | 'modal' | 'blur';

interface OptimizationOptions {
    context?: ImageContext;
    width?: number;
    quality?: 'auto' | number;
}

/**
 * Checks if a URL is a Cloudinary URL
 */
export const isCloudinaryUrl = (url: string): boolean => {
    return url.includes('cloudinary.com') || url.includes('res.cloudinary');
};

/**
 * Optimizes a Cloudinary URL with transformations for better performance
 * 
 * @param url - Original Cloudinary URL
 * @param options - Optimization options
 * @returns Optimized URL with transformations
 * 
 * @example
 * // Gallery thumbnail
 * optimizeCloudinaryUrl(url, { context: 'thumbnail' })
 * // Result: f_auto,q_auto,w_800,fl_progressive
 * 
 * // Modal full view
 * optimizeCloudinaryUrl(url, { context: 'modal' })
 * // Result: f_auto,q_auto,w_1920,fl_progressive
 * 
 * // Blur placeholder
 * optimizeCloudinaryUrl(url, { context: 'blur' })
 * // Result: f_auto,q_auto,w_50,e_blur:1000
 */
export const optimizeCloudinaryUrl = (
    url: string,
    options: OptimizationOptions = {}
): string => {
    // Return original URL if not Cloudinary
    if (!isCloudinaryUrl(url)) {
        return url;
    }

    const { context = 'thumbnail', width, quality = 'auto' } = options;

    // Define transformations based on context
    let transformations: string;

    switch (context) {
        case 'blur':
            // Tiny blur placeholder - loads instantly
            transformations = 'f_auto,q_auto,w_50,e_blur:1000';
            break;

        case 'modal':
            // Full-size for modal view - still optimized
            transformations = width
                ? `f_auto,q_${quality},w_${width},fl_progressive`
                : 'f_auto,q_auto,w_1920,fl_progressive';
            break;

        case 'thumbnail':
        default:
            // Gallery thumbnail - balanced quality/size
            transformations = width
                ? `f_auto,q_${quality},w_${width},fl_progressive`
                : 'f_auto,q_auto,w_800,fl_progressive';
            break;
    }

    // Insert transformations into Cloudinary URL
    // Cloudinary URL format: https://res.cloudinary.com/{cloud_name}/image/upload/{transformations}/{public_id}
    const uploadIndex = url.indexOf('/upload/');

    if (uploadIndex === -1) {
        // URL doesn't have /upload/ - return original
        return url;
    }

    // Check if transformations already exist
    const afterUpload = url.substring(uploadIndex + 8); // 8 = length of '/upload/'
    const hasExistingTransformations = afterUpload.match(/^[^/]+\//);

    if (hasExistingTransformations) {
        // Replace existing transformations
        return url.substring(0, uploadIndex + 8) + transformations + '/' + afterUpload.substring(afterUpload.indexOf('/') + 1);
    }

    // Add new transformations
    return url.substring(0, uploadIndex + 8) + transformations + '/' + afterUpload;
};

/**
 * Generates a blur placeholder URL for progressive image loading
 * 
 * @param url - Original Cloudinary URL
 * @returns Tiny blurred version of the image (loads instantly)
 */
export const getBlurPlaceholder = (url: string): string => {
    return optimizeCloudinaryUrl(url, { context: 'blur' });
};

/**
 * Generates optimized URLs for different contexts
 * 
 * @param url - Original Cloudinary URL
 * @returns Object with optimized URLs for different use cases
 */
export const getOptimizedUrls = (url: string) => {
    return {
        thumbnail: optimizeCloudinaryUrl(url, { context: 'thumbnail' }),
        modal: optimizeCloudinaryUrl(url, { context: 'modal' }),
        blur: getBlurPlaceholder(url),
        original: url,
    };
};
