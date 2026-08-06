import { createContext, useContext, useState, useCallback } from "react";
import apiClient from "../api/apiClient";
import toast from "react-hot-toast";
import { handleApiError } from "../utils/errorUtils";

interface EventData {
  eventName: string;
  eventDate: string;
  location: string;
  description: string;
  imageUrl: string | null;
}

interface EventResponse {
  eventSlug: string;
  [key: string]: string;
}

interface EventContextType {
  createEvent: (data: EventData) => Promise<EventResponse>;
  getAllEvent: () => Promise<EventResponse[]>;
  getEventBySlug: (slug: string) => Promise<EventResponse>;
  updateEvent: (id: string | number, data: Partial<EventData>) => Promise<EventResponse>;
  deleteEvent: (id: string | number) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const EventContext = createContext < EventContextType | null > (null);

export const EventProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState < string | null > (null);

  const createEvent = async (data: EventData): Promise<EventResponse> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post("/api/event/create", data);
      toast.success("Event created successfully!");
      console.log("Event creation response:", response.data);
      return response.data as EventResponse;
    } catch (err: unknown) {
      const errorMessage = handleApiError(
        err,
        "Failed to create event. Please try again.",
        { showToast: true, setError }
      );
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getAllEvent = useCallback(async (): Promise<EventResponse[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get("/api/event");
      console.log("Fetched events:", response.data);
      return response.data as EventResponse[];
    } catch (err: unknown) {
      const errorMessage = handleApiError(
        err,
        "Failed to fetch events. Please try again.",
        { showToast: true, setError }
      );
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getEventBySlug = useCallback(
    async (eventSlug: string): Promise<EventResponse> => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get(`/api/public/event/${eventSlug}`);
        console.log("Event fetch response:", response.data);
        return response.data as EventResponse;
      } catch (err: unknown) {
        const errorMessage = handleApiError(
          err,
          "Failed to fetch event. Please try again.",
          { showToast: true, setError }
        );
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateEvent = async (id: string | number, data: Partial<EventData>): Promise<EventResponse> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.put(`/api/event/${id}`, data);
      toast.success("Event updated successfully!");
      return response.data as EventResponse;
    } catch (err: unknown) {
      const errorMessage = handleApiError(
        err,
        "Failed to update event. Please try again.",
        { showToast: true, setError }
      );
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (id: string | number): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.delete(`/api/event/${id}`);
      toast.success("Event deleted successfully!");
    } catch (err: unknown) {
      const errorMessage = handleApiError(
        err,
        "Failed to delete event. Please try again.",
        { showToast: true, setError }
      );
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const value: EventContextType = {
    createEvent,
    getAllEvent,
    getEventBySlug,
    updateEvent,
    deleteEvent,
    loading,
    error,
  };

  return (
    <EventContext.Provider value={value}>{children}</EventContext.Provider>
  );
};

export const useEvent = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEvent must be used within an EventProvider");
  }
  return context;
};
