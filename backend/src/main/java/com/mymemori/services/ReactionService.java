package com.mymemori.services;

import com.mymemori.Repository.PhotoRepository;
import com.mymemori.Repository.ReactionRepository;
import com.mymemori.dto.ReactionDeleteReq;
import com.mymemori.dto.ReactionRequestDTO;
import com.mymemori.dto.ReactionResponse;
import com.mymemori.models.Photo;
import com.mymemori.models.Reactions;
import com.mymemori.models.Users;
import com.mymemori.util.AuthenticatedUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReactionService {

    private final ReactionRepository reactionRepo;
    private final PhotoRepository photoRepo;
    private final AuthenticatedUser authUser;

    // save reactions
    @Transactional
    public ReactionResponse saveReactions(ReactionRequestDTO request, UUID sessionId) {

        Users user = authUser.fetchAuthenticatedUser();

        if (user == null && sessionId == null) {
            throw new IllegalArgumentException(
                    "User must be authenticated with valid JWT or contain sessionID in header");
        }

        // Check if user/session has already reacted to this photo
        boolean alreadyReacted = false;
        if (user != null) {
            alreadyReacted = reactionRepo.existsByPhotoIdAndUserId(request.getPhotoId(), user.getId());
        } else if (sessionId != null) {
            alreadyReacted = reactionRepo.existsByPhotoIdAndSessionId(request.getPhotoId(), sessionId);
        }

        if (alreadyReacted) {
            // Toggle behavior: if already liked, unlike it
            log.info("User/session has already reacted to photo: {}, toggling to unlike", request.getPhotoId());

            long deletionCount;
            if (user == null) {
                deletionCount = reactionRepo.deleteByPhotoIdAndSessionId(request.getPhotoId(), sessionId);
            } else {
                deletionCount = reactionRepo.deleteByPhotoIdAndUserId(request.getPhotoId(), user.getId());
            }

            // Update photo reaction count
            if (deletionCount > 0) {
                Optional<Photo> photoOpt = photoRepo.findById(request.getPhotoId());
                if (photoOpt.isPresent()) {
                    Photo photo = photoOpt.get();
                    int currentCount = photo.getReactionCount() != null ? photo.getReactionCount() : 0;
                    photo.setReactionCount(Math.max(0, currentCount - 1));
                    photoRepo.save(photo);
                    log.info("Toggled to unlike: photoId={}, newCount={}", photo.getId(), photo.getReactionCount());
                }
            }

            // Return response indicating unliked
            ReactionResponse response = new ReactionResponse();
            response.setPhotoId(request.getPhotoId());
            response.setUserId(user != null ? user.getId() : null);
            response.setSessionId(sessionId);
            response.setImageReactionCount(reactionRepo.countByPhotoId(request.getPhotoId()));
            return response;
        }

        // Create and save reaction
        Reactions reaction = new Reactions();
        reaction.setPhotoId(request.getPhotoId());
        reaction.setSessionId(sessionId);
        reaction.setUserId(user != null ? user.getId() : null);
        reaction.setReactedAt(Instant.now());

        Reactions savedReaction = reactionRepo.save(reaction);
        log.info("Saved reaction: id={}, photoId={}", savedReaction.getId(), savedReaction.getPhotoId());

        // Update photo reaction count
        Optional<Photo> photoOpt = photoRepo.findById(request.getPhotoId());
        if (photoOpt.isPresent()) {
            Photo photo = photoOpt.get();
            int currentCount = photo.getReactionCount() != null ? photo.getReactionCount() : 0;
            photo.setReactionCount(currentCount + 1);
            photoRepo.save(photo);
            log.info("Updated photo reaction count: photoId={}, newCount={}", photo.getId(), photo.getReactionCount());
        }

        return mapToDTO(savedReaction);
    }

    public ReactionResponse mapToDTO(Reactions reactions) {
        ReactionResponse response = new ReactionResponse();

        response.setPhotoId(reactions.getPhotoId()); // Fixed: was getUserId()
        response.setUserId(reactions.getUserId());
        response.setSessionId(reactions.getSessionId());
        response.setImageReactionCount(reactionRepo.countByPhotoId(reactions.getPhotoId()));

        return response;
    }

    // delete reactions
    @Transactional
    public void deleteReactions(ReactionDeleteReq req, UUID sessionId) {

        Users user = authUser.fetchAuthenticatedUser();

        if (user == null && sessionId == null) {
            throw new IllegalArgumentException(
                    "User must be authenticated with valid JWT or contain sessionID in header");
        }

        long deletionCount;
        if (user == null) {
            deletionCount = reactionRepo.deleteByPhotoIdAndSessionId(req.getPhotoId(), sessionId);
            log.info("Deleted reaction by sessionId: photoId={}, sessionId={}, count={}", req.getPhotoId(), sessionId,
                    deletionCount);
        } else {
            deletionCount = reactionRepo.deleteByPhotoIdAndUserId(req.getPhotoId(), user.getId());
            log.info("Deleted reaction by userId: photoId={}, userId={}, count={}", req.getPhotoId(), user.getId(),
                    deletionCount);
        }

        // Update photo reaction count if deletion was successful
        if (deletionCount > 0) {
            Optional<Photo> photoOpt = photoRepo.findById(req.getPhotoId());
            if (photoOpt.isPresent()) {
                Photo photo = photoOpt.get();
                int currentCount = photo.getReactionCount() != null ? photo.getReactionCount() : 0;
                photo.setReactionCount(Math.max(0, currentCount - 1)); // Ensure count doesn't go negative
                photoRepo.save(photo);
                log.info("Updated photo reaction count after deletion: photoId={}, newCount={}", photo.getId(),
                        photo.getReactionCount());
            }
        }
    }
}
