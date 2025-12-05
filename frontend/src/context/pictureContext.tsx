import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { toast } from 'react-hot-toast';
import apiClient from '../api/apiClient';
import { uploadToCloudinary } from '../utils/upload';
import { getOrCreateSession, clearSession } from '../utils/sessionUtils';
import { handleApiError } from '../utils/errorUtils';

interface UploadedPhoto {
  photoId: string;
  imageUrl: string;
  uploader: string;
  uploadedAt: string;
  type: string;
  size: string;
  color: string;
}

interface PictureContextType {
  // For authenticated users (simple upload)
  uploadEventImage: (file: File) => Promise<string>;

  // For gallery uploads (with session management)
  uploadGalleryImage: (
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

const PictureContext = createContext < PictureContextType | null > (null);

export const PictureProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [loading, setLoading] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState < UploadedPhoto[] > ([]);
  const [defaultImages, setDefaultImages] = useState < UploadedPhoto[] > ([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  const addUploadedPhoto = useCallback((photo: UploadedPhoto) => {
    setUploadedPhotos((prev) => [...prev, photo]);
  }, []);

  // For authenticated users (simple upload)
  const uploadEventImage = useCallback(async (file: File): Promise<string> => {
    setLoading(true);
    try {
      const imageUrl = await uploadToCloudinary(file);
      return imageUrl;
    } finally {
      setLoading(false);
    }
  }, []);

  // For gallery uploads with session management
  const uploadGalleryImage = useCallback(
    async (
      file: File,
      sessionId: string,
      eventSlug: string
    ): Promise<string> => {
      setLoading(true);
      try {
        // Upload to Cloudinary
        const imageUrl = await uploadToCloudinary(file);

        // Save to backend
        try {
          const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          };

          // Add session ID to header
          if (sessionId) {
            headers['X-Session-Id'] = sessionId;
          }

          await apiClient.post(
            '/api/public/save-image',
            {
              eventSlug,
              imageUrl: [imageUrl],
            },
            { headers }
          );
        } catch (saveError: any) {
          console.error('Failed to save image to backend:', saveError);
          if (saveError.response) {
            console.error('Server response:', saveError.response.data);
          }
          toast.error('Image uploaded but failed to save to gallery');
        }

        return imageUrl;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchDefaultImages = useCallback(async (eventSlug: string) => {
    try {
      setLoading(true);

      // Get or create session ID using centralized utility
      const sessionId = await getOrCreateSession(eventSlug);

      // Fetch images with the session ID in headers
      const response = await apiClient.get("/api/public/images", {
        params: { eventSlug },
        headers: {
          "X-Session-Id": sessionId,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (response.data) {
        setDefaultImages(response.data);
      }
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as {
        response?: {
          status: number;
          data?: string;
        };
        message?: string;
      };

      console.error("Failed to fetch default images:", error);

      // If unauthorized, clear invalid session and retry once
      if (axiosError.response?.status === 401) {
        try {
          clearSession();
          const newSessionId = await getOrCreateSession(eventSlug);
          const retryResponse = await apiClient.get("/api/public/images", {
            params: { eventSlug },
            headers: { "X-Session-Id": newSessionId },
          });
          if (retryResponse.data) {
            setDefaultImages(retryResponse.data);
            return retryResponse.data;
          }
        } catch (retryError) {
          console.error("Retry failed:", retryError);
          handleApiError(
            retryError,
            "Failed to load images. Please try again.",
            { showToast: true }
          );
        }
      } else {
        handleApiError(
          error,
          "Failed to load images. Please check your connection.",
          { showToast: true }
        );
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
      const eventSlug = window.location.pathname.split("/").pop() || "";
      if (eventSlug) {
        fetchDefaultImages(eventSlug)
          .then(() => {
            setHasLoaded(true);
          })
          .catch((error) => {
            console.error("Failed to load default images:", error);
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
  const value = useMemo < PictureContextType > (
    () => ({
      uploadEventImage,
      uploadGalleryImage,
      uploadedPhotos: mergedPhotos,
      addUploadedPhoto,
      loading,
      fetchDefaultImages,
      defaultImages,
    }),
    [
      uploadEventImage,
      uploadGalleryImage,
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
