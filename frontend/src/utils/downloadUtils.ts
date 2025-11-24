import toast from "react-hot-toast";

/**
 * Downloads an image from a URL.
 * @param imageUrl The URL of the image to download.
 * @param filename The name to save the file as (default: 'image.jpg').
 */
export const downloadImage = async (imageUrl: string, filename: string = "image.jpg") => {
  try {
    // Fetch the image as a blob
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error("Network response was not ok");
    
    const blob = await response.blob();
    
    // Create a temporary link element
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    window.URL.revokeObjectURL(url);
    toast.success("Download started!");
  } catch (error) {
    console.error("Download failed:", error);
    // Fallback: Open in new tab if fetch fails (e.g. CORS)
    window.open(imageUrl, "_blank");
    toast.error("Download failed, opened in new tab instead");
  }
};
