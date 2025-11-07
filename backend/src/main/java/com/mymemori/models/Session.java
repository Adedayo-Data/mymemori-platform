package com.mymemori.models;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Entity
@Data
public class Session {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private UUID eventId;

    @Column(nullable = false)
    private String deviceType;
//    private String deviceFingerprint;
    private Instant createdAt;
    private Instant lastActiveAt;
    private Integer totalPhotosUploaded;
    private UUID convertedToUserId;

}
