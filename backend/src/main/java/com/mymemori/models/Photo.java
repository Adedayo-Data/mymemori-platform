package com.mymemori.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Entity
@Data
public class Photo {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private UUID eventId;
    private String fileUrl;
    private UUID uploadedBySessionId;
    private UUID uploadedByUserId;

    private Instant uploadedAt;
    private Integer reactionCount;
}
