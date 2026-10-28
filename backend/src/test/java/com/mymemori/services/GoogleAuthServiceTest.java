package com.mymemori.services;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.mymemori.Repository.UserRepository;
import com.mymemori.dto.AuthMessage;
import com.mymemori.exception.InvalidCredentialsException;
import com.mymemori.models.AuthProvider;
import com.mymemori.models.Users;
import com.mymemori.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GoogleAuthServiceTest {

    @Mock
    private UserRepository userRepo;

    @Mock
    private JwtService jwtService;

    @Mock
    private SessionConversionService sessionConversionService;

    @Mock
    private GoogleIdTokenVerifier verifier;

    @InjectMocks
    private GoogleAuthService googleAuthService;

    @BeforeEach
    void setUp() {
        googleAuthService.setVerifier(verifier);
    }

    private GoogleIdToken createMockGoogleIdToken(String sub, String email, String name, String picture) {
        GoogleIdToken.Payload payload = new GoogleIdToken.Payload();
        payload.setSubject(sub);
        payload.setEmail(email);
        payload.set("name", name);
        payload.set("picture", picture);

        GoogleIdToken mockToken = mock(GoogleIdToken.class);
        when(mockToken.getPayload()).thenReturn(payload);
        return mockToken;
    }

    @Test
    void authenticateWithGoogle_invalidToken_throwsInvalidCredentialsException() throws GeneralSecurityException, IOException {
        when(verifier.verify(anyString())).thenReturn(null);

        assertThrows(InvalidCredentialsException.class, () ->
                googleAuthService.authenticateWithGoogle("invalid-token", null)
        );
        verify(userRepo, never()).save(any());
    }

    @Test
    void authenticateWithGoogle_verifierThrowsException_throwsInvalidCredentialsException() throws GeneralSecurityException, IOException {
        when(verifier.verify(anyString())).thenThrow(new IOException("Network error"));

        assertThrows(InvalidCredentialsException.class, () ->
                googleAuthService.authenticateWithGoogle("bad-token", null)
        );
    }

    @Test
    void authenticateWithGoogle_returningGoogleUser_returnsJwt() throws GeneralSecurityException, IOException {
        String googleId = "google-12345";
        String email = "test@example.com";
        GoogleIdToken mockToken = createMockGoogleIdToken(googleId, email, "Test User", "http://avatar.url");
        when(verifier.verify("valid-token")).thenReturn(mockToken);

        Users existingUser = new Users();
        existingUser.setId(UUID.randomUUID());
        existingUser.setEmail(email);
        existingUser.setFullName("Test User");
        existingUser.setGoogleId(googleId);
        existingUser.setAuthProvider(AuthProvider.GOOGLE);
        existingUser.setAvatarUrl("http://avatar.url");

        when(userRepo.findByGoogleId(googleId)).thenReturn(existingUser);
        when(jwtService.generateToken(existingUser)).thenReturn("app-jwt-token");

        AuthMessage response = googleAuthService.authenticateWithGoogle("valid-token", null);

        assertNotNull(response);
        assertEquals("app-jwt-token", response.getToken());
        assertEquals(email, response.getEmail());
        assertEquals("Test User", response.getFullName());
        verify(userRepo, never()).findByEmail(anyString());
    }

    @Test
    void authenticateWithGoogle_existingLocalUser_linksGoogleAccount() throws GeneralSecurityException, IOException {
        String googleId = "google-sub-999";
        String email = "localuser@example.com";
        GoogleIdToken mockToken = createMockGoogleIdToken(googleId, email, "Local User", "http://new-avatar.url");
        when(verifier.verify("valid-token")).thenReturn(mockToken);

        Users localUser = new Users();
        localUser.setId(UUID.randomUUID());
        localUser.setEmail(email);
        localUser.setFullName("Local User");
        localUser.setPassword("hashedPassword");
        localUser.setAuthProvider(AuthProvider.LOCAL);

        when(userRepo.findByGoogleId(googleId)).thenReturn(null);
        when(userRepo.findByEmail(email)).thenReturn(localUser);
        when(userRepo.save(any(Users.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(jwtService.generateToken(any(Users.class))).thenReturn("app-jwt-token");

        AuthMessage response = googleAuthService.authenticateWithGoogle("valid-token", null);

        assertNotNull(response);
        assertEquals("app-jwt-token", response.getToken());
        assertEquals(googleId, localUser.getGoogleId());
        assertEquals(AuthProvider.LOCAL, localUser.getAuthProvider());
        assertEquals("http://new-avatar.url", localUser.getAvatarUrl());
        verify(userRepo).save(localUser);
    }

    @Test
    void authenticateWithGoogle_newGoogleUser_createsUserAndConvertsSession() throws GeneralSecurityException, IOException {
        String googleId = "new-google-sub";
        String email = "newuser@example.com";
        UUID guestSessionId = UUID.randomUUID();
        GoogleIdToken mockToken = createMockGoogleIdToken(googleId, email, "New User", "http://avatar.url");
        when(verifier.verify("valid-token")).thenReturn(mockToken);

        when(userRepo.findByGoogleId(googleId)).thenReturn(null);
        when(userRepo.findByEmail(email)).thenReturn(null);
        when(userRepo.save(any(Users.class))).thenAnswer(invocation -> {
            Users u = invocation.getArgument(0);
            u.setId(UUID.randomUUID());
            return u;
        });
        when(jwtService.generateToken(any(Users.class))).thenReturn("generated-jwt");

        AuthMessage response = googleAuthService.authenticateWithGoogle("valid-token", guestSessionId);

        assertNotNull(response);
        assertEquals("generated-jwt", response.getToken());

        ArgumentCaptor<Users> captor = ArgumentCaptor.forClass(Users.class);
        verify(userRepo).save(captor.capture());
        Users saved = captor.getValue();
        assertEquals(email, saved.getEmail());
        assertEquals(googleId, saved.getGoogleId());
        assertEquals(AuthProvider.GOOGLE, saved.getAuthProvider());
        assertNull(saved.getPassword());
        assertEquals(guestSessionId, saved.getOriginalSessionId());

        verify(sessionConversionService).convertSessionToUser(eq(guestSessionId), any(UUID.class));
    }
}
