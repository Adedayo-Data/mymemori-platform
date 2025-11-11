import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import toast from "react-hot-toast";
import apiClient from "../api/apiClient";

interface UploadedPhoto {
  id: number;
  imageUrl: string;
  uploader: string;
  uploadedAt: string;
  type: string;
  size: string;
  color: string;
}

interface PictureContextType {
  uploadImage: (
    file: File,
    sessionId: string,
    eventSlug: string
  ) => Promise<string>;
  uploadedPhotos: UploadedPhoto[];
  addUploadedPhoto: (photo: UploadedPhoto) => void;
  loading: boolean;
  fetchDefaultImages: (eventSlug: string) => Promise<void>;
  defaultImages: UploadedPhoto[];
}

const PictureContext = createContext<PictureContextType | null>(null);

export const PictureProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [loading, setLoading] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhoto[]>([]);
  const [defaultImages, setDefaultImages] = useState<UploadedPhoto[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  const addUploadedPhoto = (photo: UploadedPhoto) => {
    setUploadedPhotos((prev) => [...prev, photo]);
  };

  const uploadImage = async (
    file: File,
    sessionId: string,
    eventSlug: string
  ): Promise<string> => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      throw new Error("Invalid file type");
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "mymemori-uploads");

    try {
      // First upload to Cloudinary
      const cloudinaryResponse = await fetch(
        "https://api.cloudinary.com/v1_1/drzcrx4he/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!cloudinaryResponse.ok) {
        throw new Error("Cloudinary upload failed");
      }

      const cloudinaryData = await cloudinaryResponse.json();
      const imageUrl = cloudinaryData.secure_url;
      console.log("Cloudinary upload result:", cloudinaryData);

      // Then save to our backend
      try {
        // Send as JSON with proper headers
        const saveResponse = await apiClient.post(
          "/api/public/save-image",
          {
            sessionId,
            eventSlug,
            imageUrl: [imageUrl], // Send as array as per your backend's requirement
          },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );
        console.log("Image saved to backend:", saveResponse.data);
      } catch (saveError: any) {
        console.error("Failed to save image to backend:", saveError);
        // Log the actual error response from the server if available
        if (saveError.response) {
          console.error("Server response:", saveError.response.data);
        }
        // Don't fail the whole operation if backend save fails
        toast.error("Image uploaded but failed to save to gallery");
      }

      toast.success("Image uploaded successfully!");
      return imageUrl;
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload image");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createNewSession = async (eventSlug: string): Promise<string> => {
    try {
      const response = await apiClient.post('/api/public/create-session', {
        eventSlug,
        deviceType: 'web'
      });
      
      const { sessionId } = response.data;
      if (!sessionId) throw new Error('No session ID in response');
      
      localStorage.setItem('sessionId', sessionId);
      return sessionId;
    } catch (error) {
      console.error('Failed to create session:', error);
      throw new Error('Failed to create a new session');
    }
  };

  const fetchDefaultImages = useCallback(async (eventSlug: string) => {
    try {
      setLoading(true);
      
      // Get or create session ID
      let sessionId = localStorage.getItem('sessionId');
      
      // If no session exists, create one
      if (!sessionId) {
        sessionId = await createNewSession(eventSlug);
      }
      
      // Fetch images with the session ID in headers
      const response = await apiClient.get("/api/public/images", {
        params: { eventSlug },
        headers: { 
          'X-Session-Id': sessionId,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data) {
        setDefaultImages(response.data);
      }
      return response.data;
      
    } catch (error: unknown) {
      const axiosError = error as {
        response?: {
          status: number;
          data?: any;
        };
        message?: string;
      };
      
      console.error("Failed to fetch default images:", error);
      
      // If unauthorized, clear invalid session and retry once
      if (axiosError.response?.status === 401) {
        try {
          localStorage.removeItem('sessionId');
          const newSessionId = await createNewSession(eventSlug);
          const retryResponse = await apiClient.get("/api/public/images", {
            params: { eventSlug },
            headers: { 'X-Session-Id': newSessionId }
          });
          
          if (retryResponse.data) {
            setDefaultImages(retryResponse.data);
            return retryResponse.data;
          }
        } catch (retryError) {
          console.error("Retry failed:", retryError);
          toast.error("Failed to load images. Please try again.");
        }
      } else {
        toast.error("Failed to load images. Please check your connection.");
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load default images once when the component mounts
  useEffect(() => {
    if (!hasLoaded) {
      // Get eventSlug from URL or location state
      const eventSlug = window.location.pathname.split('/').pop() || '';
      if (eventSlug) {
        fetchDefaultImages(eventSlug).then(() => {
          setHasLoaded(true);
        }).catch(error => {
          console.error('Failed to load default images:', error);
        });
      }
    }
  }, [fetchDefaultImages, hasLoaded]);

  // Memoize the merged photos array to prevent unnecessary re-renders
  const mergedPhotos = useMemo(
    () => [...defaultImages, ...uploadedPhotos],
    [defaultImages, uploadedPhotos]
  );

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo<PictureContextType>(
    () => ({
      uploadImage,
      uploadedPhotos: mergedPhotos,
      addUploadedPhoto,
      loading,
      fetchDefaultImages,
      defaultImages,
    }),
    [
      uploadImage,
      mergedPhotos,
      addUploadedPhoto,
      loading,
      fetchDefaultImages,
      defaultImages,
    ]
  );

  return (
    <PictureContext.Provider value={value}>{children}</PictureContext.Provider>
  );
};

export const usePicture = () => {
  const context = useContext(PictureContext);
  if (!context) {
    throw new Error("usePicture must be used within a PictureProvider");
  }
  return context;
};
