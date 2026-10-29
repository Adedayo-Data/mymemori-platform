import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "./ConfirmModal";
import EditNameModal from "./EditNameModal";
import { useEvent } from "../context/eventContext";

export interface EventItem {
  eventName?: string;
  eventDate?: string;
  location?: string;
  description?: string;
  eventSlug: string;
  imageUrl?: string;
  photoCount?: number;
  id?: string | number;
  [key: string]: string | number | undefined;
}

export interface BentoEventCardProps {
  event: EventItem;
  isOwner?: boolean;
  onUpdate?: (id: string | number, newName: string) => void;
  onDelete?: (id: string | number) => void;
}

const BentoEventCard: React.FC<BentoEventCardProps> = ({
  event,
  isOwner = false,
  onUpdate,
  onDelete,
}) => {
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const { updateEvent, deleteEvent } = useEvent();

  const eventId = event.id || event.eventSlug;

  const handleDelete = async () => {
    if (!eventId) return;
    try {
      await deleteEvent(eventId);
      setShowDeleteConfirm(false);
      if (onDelete) onDelete(eventId);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = async (newName: string) => {
    if (!eventId) return;
    try {
      await updateEvent(eventId, {
        eventName: newName,
        eventDate: event.eventDate,
        location: event.location,
        description: event.description,
        imageUrl: event.imageUrl,
      });
      setShowEditModal(false);
      if (onUpdate) onUpdate(eventId, newName);
    } catch (error) {
      console.error(error);
    }
  };

  const formattedDate = event.eventDate
    ? new Date(event.eventDate).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })
    : "TBD";

  return (
    <>
      <article
        onClick={() => navigate(`/gallery?event=${event.eventSlug}`)}
        className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-5 flex flex-col gap-3.5 relative overflow-hidden group cursor-pointer hover:border-white/25 transition-all duration-300"
      >
        {/* Glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary-container/20 blur-3xl rounded-full pointer-events-none" />

        {/* Header: Title, Date & Action Buttons */}
        <div className="flex justify-between items-start z-10">
          <div className="pr-2 min-w-0">
            <h3 className="font-title-md text-title-md text-on-surface truncate group-hover:text-primary transition-colors">
              {event.eventName || "Untitled Event"}
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant text-sm flex items-center gap-1.5 mt-1">
              <span className="material-symbols-outlined text-[16px]">calendar_today</span>
              {formattedDate} {event.location ? `• ${event.location}` : ""}
            </p>
          </div>

          {isOwner && (
            <div className="flex gap-2 shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowEditModal(true);
                }}
                title="Edit Event Name"
                className="p-1.5 rounded-full bg-surface-container hover:bg-white/10 border border-white/5 text-on-surface-variant hover:text-white transition-colors flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">edit</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteConfirm(true);
                }}
                title="Delete Event"
                className="p-1.5 rounded-full bg-error-container/20 hover:bg-error-container/40 border border-error/20 text-error transition-colors flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">delete</span>
              </button>
            </div>
          )}
        </div>

        {/* Thumbnail Image */}
        <div className="h-36 w-full mt-2 rounded-lg bg-surface-container-high overflow-hidden border border-white/5 relative z-10">
          {event.imageUrl ? (
            <img
              src={event.imageUrl}
              alt={event.eventName || "Event banner"}
              className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-surface-container/60 text-on-surface-variant/40">
              <span className="material-symbols-outlined text-4xl">image</span>
            </div>
          )}
          {event.photoCount !== undefined && event.photoCount > 0 && (
            <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-md text-xs text-white border border-white/10 font-label-md flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">photo_library</span>
              {event.photoCount} Photos
            </div>
          )}
        </div>
      </article>

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Event"
        description={`Are you sure you want to delete "${event.eventName}"? This will permanently remove the event and its photos.`}
        confirmText="Delete Event"
        isDestructive={true}
      />

      <EditNameModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleEdit}
        initialName={event.eventName || ""}
        title="Edit Event Name"
      />
    </>
  );
};

export default BentoEventCard;
