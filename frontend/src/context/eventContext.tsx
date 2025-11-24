import { createContext, useContext, useState, useCallback } from "react";
import apiClient from "../api/apiClient";
import toast from "react-hot-toast";

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
  getEventBySlug: (slug: string) => Promise<EventResponse>;
  loading: boolean;
  error: string | null;
}

const EventContext = createContext<EventContextType | null>(null);

export const EventProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createEvent = async (data: EventData): Promise<EventResponse> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post("/api/event/create", data);
      toast.success("Event created successfully!");
      console.log("Event creation response:", response.data);
      return response.data as EventResponse;
    } catch (err: unknown) {
      const errorMessage =
        (err as any)?.response?.data?.message ||
        "Failed to create event. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getEventBySlug = useCallback(
    async (eventSlug: string): Promise<EventResponse> => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get(`/api/event/${eventSlug}`);
        console.log("Event fetch response:", response.data);
        return response.data as EventResponse;
      } catch (err: unknown) {
        const errorMessage =
          (err as any)?.response?.data?.message ||
          "Failed to fetch event. Please try again.";
        setError(errorMessage);
        toast.error(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );
  const value: EventContextType = {
    createEvent,
    getEventBySlug,
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
