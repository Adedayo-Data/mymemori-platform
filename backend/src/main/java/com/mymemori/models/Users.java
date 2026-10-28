package com.mymemori.models;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Data
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    private String email;
    private String fullName;

    /** Null for Google-auth users — never try to match a password against null. */
    private String password;

    /** Google's unique "sub" claim — stored to detect returning Google users. */
    @Column(unique = true)
    private String googleId;

    /** Profile picture URL provided by Google (optional). */
    private String avatarUrl;

    /** How the user signed up — defaults to LOCAL for existing users. */
    @Enumerated(EnumType.STRING)
    private AuthProvider authProvider = AuthProvider.LOCAL;

    public AuthProvider getAuthProvider() {
        return authProvider != null ? authProvider : AuthProvider.LOCAL;
    }

    @Enumerated(EnumType.STRING)
    private UserRole Role;

    @CreationTimestamp
    private Instant created_At;

    private UUID originalSessionId;
}

