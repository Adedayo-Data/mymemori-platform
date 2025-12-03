package com.mymemori.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class SessionResponseDTO {

    private UUID sessionId;
    private String message;
}
