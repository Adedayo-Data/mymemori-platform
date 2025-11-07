package com.mymemori.models;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.time.Instant;
import java.util.UUID;

public class Reactions {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    private UUID photoId;
    private UUID sessionId;
    private UUID userId;
    private Instant reactedAt;

}
