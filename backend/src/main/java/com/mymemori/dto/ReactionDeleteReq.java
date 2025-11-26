package com.mymemori.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class ReactionDeleteReq {

    @NotNull(message = "Photo id cannot be null")
    private UUID photoId;
//    private UUID userId;
//    private UUID sessionId;
}
