import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from 'react';
import apiClient from '../api/apiClient';
import { uploadToCloudinary } from '../utils/upload';
import { getOrCreateSession, clearSession } from '../utils/sessionUtils';
import { handleApiError } from '../utils/errorUtils';

export interface UploadedPhoto {
  photoId: string;
  imageUrl: string;
  uploader: string;
  uploadedAt: string;
  type: string;
  size: string;
  color: string;
  canDelete?: boolean;
  reactionCount?: number;
  isLikedByCurrentUser?: boolean;
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
  fetchDefaultImages: (eventSlug: string, existingSessionId?: string, silent?: boolean) => Promise<void>;
  defaultImages: UploadedPhoto[];
  getAllPhoto: () => Promise<UploadedPhoto[]>;
  getLikedPhotos: () => Promise<UploadedPhoto[]>;
  deletePhoto: (photoId: string) => Promise<void>;
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
          // Don't show toast here - let the calling component handle it
          throw saveError;
        }

        return imageUrl;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchDefaultImages = useCallback(async (eventSlug: string, existingSessionId?: string, silent: boolean = false) => {
    try {
      if (!silent) setLoading(true);
      // Check if user is authenticated - if so, don't create a session
      const hasAuthToken = !!localStorage.getItem("authToken");
      let sessionId: string | undefined = existingSessionId;

      if (!hasAuthToken && !sessionId) {
        // Only create NEW session if we don't have one already
        sessionId = await getOrCreateSession(eventSlug);
      }

      // Fetch images with the session ID in headers (if guest) or auth token (if authenticated)
      const headers: Record<string, string> = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };

      // Only add session header for guest users
      if (sessionId) {
        headers["X-Session-Id"] = sessionId;
      }

      const response = await apiClient.post("/api/public/images",
        { eventSlug },
        { headers }
      );

      if (response.data) {
        setDefaultImages(response.data);
      }
      return response.data;
    } catch (error: unknown) {
      if (silent) {
        console.warn("Silent photo fetch failed:", error);
        return;
      }

      const axiosError = error as {
        response?: {
          status: number;
          data?: string;
        };
        message?: string;
      };

      console.error("Failed to fetch default images:", error);

      // If unauthorized, clear invalid session and retry once (only for guest users)
      if (axiosError.response?.status === 401) {
        const hasAuthToken = !!localStorage.getItem("authToken");

        if (!hasAuthToken) {
          // Only retry with new session for guest users
          try {
            clearSession();
            const newSessionId = await getOrCreateSession(eventSlug);
            const retryResponse = await apiClient.post("/api/public/images",
              { eventSlug },
              { headers: { "X-Session-Id": newSessionId } }
            );

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
      if (!silent) setLoading(false);
    }
  }, []);

  const getAllPhoto = async () => {
    try {
      const response = await apiClient.get("/api/public/my-photos");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch default images:", error);
    }
  }

  const getLikedPhotos = async () => {
    try {
      const response = await apiClient.get("/api/public/liked-photos");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch liked photos:", error);
      return [];
    }
  }

  const deletePhoto = useCallback(async (photoId: string): Promise<void> => {
    try {
      await apiClient.delete(`/api/public/photo/${photoId}`);
      // Remove from local state immediately for optimistic UI
      setDefaultImages((prev) => prev.filter((p) => p.photoId !== photoId));
      setUploadedPhotos((prev) => prev.filter((p) => p.photoId !== photoId));
    } catch (error) {
      console.error("Failed to delete photo:", error);
      throw error;
    }
  }, []);

  // Memoize the merged photos array to prevent unnecessary re-renders
  // Deduplicate: Remove temp optimistic photos if backend has returned the real version
  const mergedPhotos = useMemo(() => {
    const backendImageUrls = new Set(defaultImages.map(p => p.imageUrl));
    const dedupedUploadedPhotos = uploadedPhotos.filter(
      p => !backendImageUrls.has(p.imageUrl)
    );
    return [...defaultImages, ...dedupedUploadedPhotos];
  }, [defaultImages, uploadedPhotos]);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo<PictureContextType>(
    () => ({
      uploadEventImage,
      uploadGalleryImage,
      uploadedPhotos: mergedPhotos,
      addUploadedPhoto,
      loading,
      fetchDefaultImages,
      defaultImages,
      getAllPhoto,
      getLikedPhotos,
      deletePhoto,
    }),
    [
      uploadEventImage,
      uploadGalleryImage,
      mergedPhotos,
      addUploadedPhoto,
      loading,
      fetchDefaultImages,
      defaultImages,
      getAllPhoto,
      getLikedPhotos,
      deletePhoto,
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
