package com.mymemori.Repository;

import com.mymemori.models.Photo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PhotoRepository extends JpaRepository<Photo, UUID> {

    @Query(value = "SELECT * FROM photo ORDER BY RANDOM() LIMIT 10", nativeQuery = true)
    List<Photo> findRandomTen();

    List<Photo> findByUploadedBySessionId(UUID sessionId);

    List<Photo> findByUploadedByUserId(UUID userId);
}
