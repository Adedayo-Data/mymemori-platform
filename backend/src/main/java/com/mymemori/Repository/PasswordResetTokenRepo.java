package com.mymemori.Repository;

import com.mymemori.models.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

public interface PasswordResetTokenRepo extends JpaRepository<PasswordResetToken, UUID> {

    Optional<PasswordResetToken> findByTokenHash(String tokenHash);

    @Modifying
    @Query("delete from PasswordResetToken t where t.userId = :userId")
    void deleteAllByUserId(@Param("userId") UUID userId);

    // Atomic "use once": returns 1 only if the token was unused AND not expired
    @Modifying
    @Query("update PasswordResetToken t set t.usedAt = :now " +
            "where t.id = :id and t.usedAt is null and t.expiresAt > :now")
    int markUsed(@Param("id") UUID id, @Param("now") Instant now);

    @Modifying
    @Query("delete from PasswordResetToken t where t.expiresAt < :now")
    int deleteExpired(@Param("now") Instant now);

}
