package com.mymemori.services;

import com.mymemori.Repository.PasswordResetTokenRepo;
import com.mymemori.exception.InvalidResetTokenException;
import com.mymemori.models.PasswordResetToken;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.HexFormat;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PasswordResetTokenService {

    private static final long EXPIRY_MINUTES = 30;
    private static final SecureRandom RANDOM = new SecureRandom();

    private final PasswordResetTokenRepo tokenRepo;

    /** Creates a new token, wipes the user's old ones, returns the RAW token (for the email only). */
    @Transactional
    public String createToken(UUID userId) {
        tokenRepo.deleteAllByUserId(userId);

        byte[] bytes = new byte[32];
        RANDOM.nextBytes(bytes);
        String rawToken = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);

        PasswordResetToken entity = new PasswordResetToken();
        entity.setUserId(userId);
        entity.setTokenHash(hash(rawToken));
        entity.setExpiresAt(Instant.now().plus(EXPIRY_MINUTES, ChronoUnit.MINUTES));
        tokenRepo.save(entity);

        return rawToken;
    }

    /** Validates and burns the token in one atomic step. Returns the user ID it belongs to. */
    @Transactional
    public UUID consume(String rawToken) {
        PasswordResetToken token = tokenRepo.findByTokenHash(hash(rawToken))
                .orElseThrow(InvalidResetTokenException::new);

        int updated = tokenRepo.markUsed(token.getId(), Instant.now());
        if (updated != 1) {
            throw new InvalidResetTokenException();   // already used or expired
        }
        return token.getUserId();
    }

    @Transactional
    public void invalidateAllForUser(UUID userId) {
        tokenRepo.deleteAllByUserId(userId);
    }

    private String hash(String raw) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(digest.digest(raw.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }
}