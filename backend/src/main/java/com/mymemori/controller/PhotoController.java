package com.mymemori.controller;

import com.mymemori.dto.PhotoRequestDTO;
import com.mymemori.dto.PhotoResponseDTO;
import com.mymemori.dto.ViewGalleryRequest;
import com.mymemori.services.PhotoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
@Slf4j
public class PhotoController {

    private final PhotoService photoService;

    // save photos
    @PostMapping("/save-image")
    @Transactional
    public ResponseEntity<List<PhotoResponseDTO>> savePhotos(
            @RequestHeader(value = "X-Session-Id", required = false) UUID sessionId,
            @Valid @RequestBody PhotoRequestDTO request) {

        log.info("Photo upload request received: sessionId={}, eventSlug={}", sessionId, request.getEventSlug());

        List<PhotoResponseDTO> response = photoService.savePhoto(request, sessionId);

        if (response.isEmpty()) {
            log.warn("No photos were saved for sessionId={}", sessionId);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
        log.info("Successfully saved {} photos", response.size());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // TO FIX: Implement the strategy by which images are loaded back to the list.
    // For now UI should randomize output

    // Initial Gallery Call
    // FOMO strategy
    @PostMapping("/images")
    public ResponseEntity<List<PhotoResponseDTO>> findFiveImage(
            @RequestBody ViewGalleryRequest request,
            @RequestHeader(value = "X-Session-Id", required = false) UUID sessionId) {
        System.out.println("Session id is: " + sessionId);
        List<PhotoResponseDTO> response = photoService.getOnlyTen(request, sessionId);

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    // Get all photos for authenticated user or session
    @GetMapping("/my-photos")
    public ResponseEntity<List<PhotoResponseDTO>> getMyPhotos(
            @RequestHeader(value = "X-Session-Id", required = false) UUID sessionId) {
        List<PhotoResponseDTO> response = photoService.getPhotosByUserOrSession(sessionId);
        return ResponseEntity.ok(response);
    }

    // Get event details by slug (public endpoint for gallery access)
    @GetMapping("/event/{slug}")
    public ResponseEntity<com.mymemori.dto.EventResponse> getEventBySlug(@PathVariable String slug) {
        com.mymemori.dto.EventResponse response = photoService.getEventBySlug(slug);
        return ResponseEntity.ok(response);
    }
}
