package com.mymemori.dto;

import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
public class ReactionRequestDTO {

    private UUID photoId;
    private UUID sessionId;
    private UUID userId;
    private Instant reactedAt = Instant.now();
}
