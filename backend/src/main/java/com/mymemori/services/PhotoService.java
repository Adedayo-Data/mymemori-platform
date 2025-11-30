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
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
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
        System.out.println("Request slug: " + request.getEventSlug());
        System.out.println("Event is: " + event.getEventName());

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
        return response;
    }

    // FOMO STRATEGY:
    /*
     * In this strategy, users only get to see a random array of 5 images and can
     * only see more if they upload.
     *
     * TO FIX: implement a better strategy as this allow database level sorting
     * thereby increasing database use of resources'
     */
    public List<PhotoResponseDTO> getOnlyTen(ViewGalleryRequest request, UUID sessionId) {

        Users user = authUser.fetchAuthenticatedUser();

        if (user == null && sessionId == null) {
            throw new IllegalArgumentException(
                    "User must be authenticated with JWT in header or contain sessionID in Requestbody");
        }

        List<Photo> getTenPhotos = photoRepo.findRandomTen();

        List<PhotoResponseDTO> response = new ArrayList<>();

        for (Photo p : getTenPhotos) {
            PhotoResponseDTO photoResponse = mapToDTO(p);
            response.add(photoResponse);
        }
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

}
