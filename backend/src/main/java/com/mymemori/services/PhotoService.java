package com.mymemori.services;

import com.mymemori.Repository.PhotoRepository;
import com.mymemori.dto.PhotoRequestDTO;
import com.mymemori.dto.PhotoResponseDTO;
import com.mymemori.models.Photo;
import com.mymemori.models.Users;
import com.mymemori.util.AuthenticatedUser;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PhotoService {

    private final AuthenticatedUser authUser;
    private final PhotoRepository photoRepo;

    // save Photos
    public List<PhotoResponseDTO> savePhoto(PhotoRequestDTO request) {
        Users user = authUser.fetchAuthenticatedUser();

        if (user == null && request.getSessionId() == null) {
            throw new IllegalArgumentException("User must be authenticated with JWT in header or contain sessionID in Requestbody");
        }

        List<PhotoResponseDTO> response = new ArrayList<>();

        for (String s : request.getImageUrl()) {
            Photo photo = new Photo();

            // save the values generic for all images of the user
            photo.setEventId(request.getEventId());
            photo.setImageUrl(s);
            photo.setUploadedAt(Instant.now());
            photo.setReactionCount(0);

            if (user == null) {
                photo.setUploadedByUserId(null);
                photo.setUploadedBySessionId(request.getSessionId());
            } else {
                photo.setUploadedByUserId(user.getId());
                photo.setUploadedBySessionId(null);
            }

            Photo savedPhoto = photoRepo.save(photo);
            response.add(mapToDTO(savedPhoto));
        }
        return response;
    }

    public PhotoResponseDTO mapToDTO(Photo photo){
        PhotoResponseDTO response = new PhotoResponseDTO();
        response.setPhotoId(photo.getId());
        response.setEventId(photo.getEventId());
        response.setSessionId(photo.getUploadedBySessionId());
        response.setUserId(photo.getUploadedByUserId());
        response.setImageUrl(photo.getImageUrl());

        return response;
    }
}

