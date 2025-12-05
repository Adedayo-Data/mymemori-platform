package com.mymemori.services;

import com.mymemori.Repository.EventRepository;
import com.mymemori.Repository.PhotoRepository;
import com.mymemori.dto.PhotoRequestDTO;
import com.mymemori.dto.PhotoResponseDTO;
import com.mymemori.dto.ViewGalleryRequest;
import com.mymemori.models.Event;
import com.mymemori.models.Photo;
import com.mymemori.models.Users;
import com.mymemori.util.AuthenticatedUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PhotoService {

    private final AuthenticatedUser authUser;
    private final PhotoRepository photoRepo;
    private final EventRepository eventRepo;

    // save Photos
    public List<PhotoResponseDTO> savePhoto(PhotoRequestDTO request, UUID sessionId) {
        Users user = authUser.fetchAuthenticatedUser();

        if (user == null && sessionId == null) {
            throw new IllegalArgumentException(
                    "User must be authenticated with JWT in header or contain sessionID in Requestbody");
        }

        List<PhotoResponseDTO> response = new ArrayList<>();

        Event event = eventRepo.findByEventSlug(request.getEventSlug());
        log.info("Saving photos for event: slug={}, eventName={}", request.getEventSlug(), event.getEventName());

        for (String s : request.getImageUrl()) {
            Photo photo = new Photo();

            // save the values generic for all images of the user
            photo.setEventId(event.getId());
            photo.setImageUrl(s);
            photo.setUploadedAt(Instant.now());
            photo.setReactionCount(0);

            if (user == null) {
                photo.setUploadedByUserId(null);
                photo.setUploadedBySessionId((UUID) sessionId);
            } else {
                photo.setUploadedByUserId(user.getId());
                photo.setUploadedBySessionId(null);
            }

            Photo savedPhoto = photoRepo.save(photo);
            response.add(mapToDTO(savedPhoto));
        }
        log.info("Saved {} photos for event: {}", response.size(), event.getEventName());
        return response;
    }

    // FOMO STRATEGY:
    /*
     * In this strategy, users only get to see a random array of 10 images
     * initially.
     * Once they upload at least one photo, they can see ALL photos for the event.
     * This encourages user participation and engagement.
     */
    public List<PhotoResponseDTO> getOnlyTen(ViewGalleryRequest request, UUID sessionId) {

        Users user = authUser.fetchAuthenticatedUser();

        if (user == null && sessionId == null) {
            throw new IllegalArgumentException(
                    "User must be authenticated with JWT in header or contain sessionID in header");
        }

        // Fetch the event by slug
        Event event = eventRepo.findByEventSlug(request.getEventSlug());
        if (event == null) {
            throw new IllegalArgumentException("Event not found with slug: " + request.getEventSlug());
        }

        log.info("Fetching photos for event: slug={}, eventId={}", request.getEventSlug(), event.getId());

        // Check if user/session has uploaded photos for this event
        boolean hasUploaded = false;
        if (user != null) {
            hasUploaded = photoRepo.hasUserUploadedForEvent(event.getId(), user.getId());
            log.info("User {} has uploaded: {}", user.getEmail(), hasUploaded);
        } else if (sessionId != null) {
            hasUploaded = photoRepo.hasSessionUploadedForEvent(event.getId(), sessionId);
            log.info("Session {} has uploaded: {}", sessionId, hasUploaded);
        }

        List<Photo> photos;
        if (hasUploaded) {
            // User has uploaded - show ALL photos for this event
            photos = photoRepo.findByEventId(event.getId());
            log.info("User has uploaded, returning ALL {} photos", photos.size());
        } else {
            // User hasn't uploaded - show only 10 random photos (FOMO)
            photos = photoRepo.findRandomTenByEventId(event.getId());
            log.info("User hasn't uploaded, returning {} random photos (FOMO)", photos.size());
        }

        List<PhotoResponseDTO> response = new ArrayList<>();
        for (Photo p : photos) {
            PhotoResponseDTO photoResponse = mapToDTO(p);
            response.add(photoResponse);
        }

        log.info("Returning {} photos for event: {}", response.size(), event.getEventName());
        return response;
    }

    // Get all photos for authenticated user or session
    public List<PhotoResponseDTO> getPhotosByUserOrSession(UUID sessionId) {
        Users user = authUser.fetchAuthenticatedUser();

        List<Photo> photos;

        if (user != null) {
            // Authenticated user - get their photos
            photos = photoRepo.findByUploadedByUserId(user.getId());
        } else if (sessionId != null) {
            // Session user - get photos by session ID
            photos = photoRepo.findByUploadedBySessionId(sessionId);
        } else {
            throw new IllegalArgumentException("User must be authenticated with JWT or provide a valid session ID");
        }

        List<PhotoResponseDTO> response = new ArrayList<>();
        for (Photo photo : photos) {
            response.add(mapToDTO(photo));
        }

        return response;
    }

    public PhotoResponseDTO mapToDTO(Photo photo) {
        PhotoResponseDTO response = new PhotoResponseDTO();
        response.setPhotoId(photo.getId());
        response.setEventId(photo.getEventId());
        response.setSessionId(photo.getUploadedBySessionId());
        response.setUserId(photo.getUploadedByUserId());
        response.setImageUrl(photo.getImageUrl());

        return response;
    }

    // Get event by slug (for public access)
    public com.mymemori.dto.EventResponse getEventBySlug(String slug) {
        Event event = eventRepo.findByEventSlug(slug);
        if (event == null) {
            throw new IllegalArgumentException("Event not found with slug: " + slug);
        }

        com.mymemori.dto.EventResponse response = new com.mymemori.dto.EventResponse();
        response.setEventName(event.getEventName());
        response.setEventDate(event.getEventDate());
        response.setLocation(event.getLocation());
        response.setDescription(event.getDescription());
        response.setEventSlug(event.getEventSlug());
        response.setImageUrl(event.getImageUrl());

        return response;
    }

}
