package com.mymemori.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class ReactionDeleteReq {

    private UUID photoId;
    private UUID userId;
    private UUID sessionId;
}
