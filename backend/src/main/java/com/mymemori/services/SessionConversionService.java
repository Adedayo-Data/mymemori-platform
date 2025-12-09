package com.mymemori.services;

import com.mymemori.Repository.PhotoRepository;
import com.mymemori.Repository.ReactionRepository;
import com.mymemori.models.Photo;
import com.mymemori.models.Reactions;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class SessionConversionService {

    private final PhotoRepository photoRepo;
    private final ReactionRepository reactionRepo;

    /**
     * Convert all session data (photos and reactions) to authenticated user data
     * This is called when a session user signs up for an account
     *
     * @param sessionId The session ID to convert
     * @param userId    The new user ID to transfer data to
     */
    @Transactional
    public void convertSessionToUser(UUID sessionId, UUID userId) {
        if (sessionId == null || userId == null) {
            log.warn("Cannot convert session: sessionId or userId is null");
            return;
        }

        log.info("Starting session conversion: sessionId={}, userId={}", sessionId, userId);

        // Convert photos
        int photosConverted = convertPhotos(sessionId, userId);

        // Convert reactions
        int reactionsConverted = convertReactions(sessionId, userId);

        log.info("Session conversion completed: sessionId={}, userId={}, photosConverted={}, reactionsConverted={}",
                sessionId, userId, photosConverted, reactionsConverted);
    }

    /**
     * Transfer all photos from session to user
     */
    private int convertPhotos(UUID sessionId, UUID userId) {
        List<Photo> sessionPhotos = photoRepo.findByUploadedBySessionId(sessionId);

        if (sessionPhotos.isEmpty()) {
            log.info("No photos to convert for sessionId={}", sessionId);
            return 0;
        }

        log.info("Converting {} photos from sessionId={} to userId={}", sessionPhotos.size(), sessionId, userId);

        for (Photo photo : sessionPhotos) {
            photo.setUploadedByUserId(userId);
            photo.setUploadedBySessionId(null);
            photoRepo.save(photo);
        }

        return sessionPhotos.size();
    }

    /**
     * Transfer all reactions from session to user
     */
    private int convertReactions(UUID sessionId, UUID userId) {
        List<Reactions> sessionReactions = reactionRepo.findAllBySessionId(sessionId);

        if (sessionReactions.isEmpty()) {
            log.info("No reactions to convert for sessionId={}", sessionId);
            return 0;
        }

        log.info("Converting {} reactions from sessionId={} to userId={}", sessionReactions.size(), sessionId, userId);

        for (Reactions reaction : sessionReactions) {
            reaction.setUserId(userId);
            reaction.setSessionId(null);
            reactionRepo.save(reaction);
        }

        return sessionReactions.size();
    }
}
