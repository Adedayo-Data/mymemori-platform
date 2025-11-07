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

    @Modifying
    @Transactional
    long deleteByPhotoIdAndUserId(UUID photoId, UUID userId);

    @Modifying
    @Transactional
    long deleteByPhotoIdAndSessionId(UUID PhotoId, UUID sessionId);
}
