package com.mymemori.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class ReactionResponse {

    private UUID photoId;
    private UUID sessionId;
    private UUID userId;
    private Long imageReactionCount;
}
