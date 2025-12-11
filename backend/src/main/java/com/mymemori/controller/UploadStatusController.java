package com.mymemori.controller;

import com.mymemori.Repository.EventRepository;
import com.mymemori.Repository.PhotoRepository;
import com.mymemori.models.Event;
import com.mymemori.models.Users;
import com.mymemori.util.AuthenticatedUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/public/upload-status")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class UploadStatusController {

    private final PhotoRepository photoRepository;
    private final EventRepository eventRepository;
    private final AuthenticatedUser authUser;

    /**
     * Check if the current user/session has uploaded any photos for the given event
     */
    @GetMapping
    public ResponseEntity<Map<String, Boolean>> checkUploadStatus(
            @RequestParam String eventSlug,
            @RequestHeader(value = "X-Session-Id", required = false) String sessionIdHeader) {
        log.info("Checking upload status for event: {}", eventSlug);

        boolean hasUploaded = false;

        // Get event by slug
        Event event = eventRepository.findByEventSlug(eventSlug);
        if (event == null) {
            log.warn("Event not found with slug: {}", eventSlug);
            Map<String, Boolean> response = new HashMap<>();
            response.put("hasUploaded", false);
            return ResponseEntity.ok(response);
        }

        try {
            // Try to get authenticated user first
            Users user = authUser.fetchAuthenticatedUser();
            if (user != null) {
                // Check if authenticated user has uploaded for THIS event
                UUID userId = user.getId();
                hasUploaded = photoRepository.hasUserUploadedForEvent(event.getId(), userId);
                log.info("Authenticated user {} has uploaded for event {}: {}", userId, eventSlug, hasUploaded);
            }
        } catch (Exception e) {
            // User not authenticated, check session
            log.debug("User not authenticated, checking session: {}", e.getMessage());
        }

        // If not authenticated, check session
        if (!hasUploaded && sessionIdHeader != null && !sessionIdHeader.isEmpty()) {
            try {
                UUID sessionId = UUID.fromString(sessionIdHeader);
                hasUploaded = photoRepository.hasSessionUploadedForEvent(event.getId(), sessionId);
                log.info("Session {} has uploaded for event {}: {}", sessionId, eventSlug, hasUploaded);
            } catch (IllegalArgumentException ex) {
                log.warn("Invalid session ID format: {}", sessionIdHeader);
            }
        }

        Map<String, Boolean> response = new HashMap<>();
        response.put("hasUploaded", hasUploaded);

        return ResponseEntity.ok(response);
    }
}
