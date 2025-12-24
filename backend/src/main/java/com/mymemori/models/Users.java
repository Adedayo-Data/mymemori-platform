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
    private String password;

    // Add user role based on payment
    @Enumerated(EnumType.STRING)
    private UserRole Role;

    @CreationTimestamp
    private Instant created_At;

    private UUID originalSessionId;
}
