package com.mymemori.Repository;

import com.mymemori.models.Reactions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Repository
public interface ReactionRepository extends JpaRepository<Reactions, UUID> {

    @Override
    long count();

    // Check if user/session has already reacted to a photo
    boolean existsByPhotoIdAndUserId(UUID photoId, UUID userId);

    boolean existsByPhotoIdAndSessionId(UUID photoId, UUID sessionId);

    // Count reactions for a specific photo
    long countByPhotoId(UUID photoId);

    // Find user's reaction for a photo
    java.util.Optional<Reactions> findByPhotoIdAndUserId(UUID photoId, UUID userId);

    java.util.Optional<Reactions> findByPhotoIdAndSessionId(UUID photoId, UUID sessionId);

    @Modifying
    @Transactional
    long deleteByPhotoIdAndUserId(UUID photoId, UUID userId);

    @Modifying
    @Transactional
    long deleteByPhotoIdAndSessionId(UUID PhotoId, UUID sessionId);
}
