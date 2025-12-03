package com.mymemori.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
public class ReactionRequestDTO {

    @NotNull(message = "Photo Cannot be Blank")
    private UUID photoId;

    private Instant reactedAt = Instant.now();
}
