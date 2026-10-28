package com.mymemori.services;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.mymemori.Repository.UserRepository;
import com.mymemori.dto.AuthMessage;
import com.mymemori.exception.InvalidCredentialsException;
import com.mymemori.models.AuthProvider;
import com.mymemori.models.UserRole;
import com.mymemori.models.Users;
import com.mymemori.security.JwtService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;

@Service
@RequiredArgsConstructor
@Slf4j
public class GoogleAuthService {

    private final UserRepository userRepo;
    private final JwtService jwtService;
    private final SessionConversionService sessionConversionService;

    @Value("${google.client-id}")
    private String googleClientId;

    /** Built lazily after @Value injection completes. */
    private GoogleIdTokenVerifier verifier;

    @PostConstruct
    void init() {
        if (verifier == null) {
            verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), GsonFactory.getDefaultInstance())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();
        }
    }

    /** Package-private for testing */
    void setVerifier(GoogleIdTokenVerifier verifier) {
        this.verifier = verifier;
    }

    /**
     * Verifies the Google ID token, then finds or creates a user.
     *
     * @param rawIdToken the credential string from Google's Sign In with Google button
     * @param sessionId  optional guest session ID to migrate photos/reactions
     * @return AuthMessage containing your app's JWT, email, fullName
     */
    @Transactional
    public AuthMessage authenticateWithGoogle(String rawIdToken, java.util.UUID sessionId) {
        GoogleIdToken.Payload payload = verifyToken(rawIdToken);

        String googleId = payload.getSubject();          // unique Google user ID
        String email    = payload.getEmail();
        String name     = (String) payload.get("name");
        String picture  = (String) payload.get("picture");

        log.info("Google sign-in attempt for email={}", email);

        // 1. Try to find by googleId first (fastest path for returning users)
        Users user = userRepo.findByGoogleId(googleId);

        if (user == null) {
            // 2. Try to find by email — user may have signed up with email/password before
            user = userRepo.findByEmail(email);

            if (user != null) {
                // Link the Google account to the existing email/password account
                log.info("Linking Google account to existing email account for email={}", email);
                user.setGoogleId(googleId);
                user.setAvatarUrl(picture);
                if (sessionId != null && user.getOriginalSessionId() == null) {
                    user.setOriginalSessionId(sessionId);
                }
                // Keep their existing authProvider as LOCAL so password login still works
                user = userRepo.save(user);
            } else {
                // 3. Brand new user — create account
                log.info("Creating new Google user for email={}", email);
                user = new Users();
                user.setEmail(email);
                user.setFullName(name != null ? name : email);
                user.setGoogleId(googleId);
                user.setAvatarUrl(picture);
                user.setAuthProvider(AuthProvider.GOOGLE);
                user.setRole(UserRole.REGULAR_USER);
                if (sessionId != null) {
                    user.setOriginalSessionId(sessionId);
                }
                // password is intentionally null — Google users never need it
                user = userRepo.save(user);
            }
        } else {
            // Returning Google user — refresh their avatar in case it changed
            if (picture != null && !picture.equals(user.getAvatarUrl())) {
                user.setAvatarUrl(picture);
                user = userRepo.save(user);
            }
        }

        // Convert guest session data if sessionId provided
        if (sessionId != null) {
            try {
                sessionConversionService.convertSessionToUser(sessionId, user.getId());
                log.info("Session data converted successfully for userId={}", user.getId());
            } catch (Exception e) {
                log.error("Failed to convert session data for userId={}, sessionId={}", user.getId(), sessionId, e);
            }
        }

        // Issue your own application JWT
        String appToken = jwtService.generateToken(user);

        AuthMessage response = new AuthMessage();
        response.setToken(appToken);
        response.setEmail(user.getEmail());
        response.setFullName(user.getFullName());
        response.setMessage("Google sign-in successful");

        log.info("Google sign-in successful for userId={}", user.getId());
        return response;
    }

    /**
     * Overload for backward-compatibility or when sessionId is omitted.
     */
    @Transactional
    public AuthMessage authenticateWithGoogle(String rawIdToken) {
        return authenticateWithGoogle(rawIdToken, null);
    }

    /**
     * Verifies the token signature, expiry, and audience against your Google Client ID.
     * Throws RuntimeException if the token is invalid — the GlobalExceptionHandler
     * will turn this into a 500; add a dedicated exception class if you want a 401.
     */
    private GoogleIdToken.Payload verifyToken(String rawIdToken) {
        try {
            GoogleIdToken idToken = verifier.verify(rawIdToken);
            if (idToken == null) {
                log.warn("Google token verification returned null — token is invalid or expired");
                throw new InvalidCredentialsException("Invalid or expired Google token");
            }
            return idToken.getPayload();
        } catch (GeneralSecurityException | IOException e) {
            log.error("Google token verification failed", e);
            throw new InvalidCredentialsException("Failed to verify Google token");
        }
    }
}
