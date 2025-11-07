package com.mymemori.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class SessionRequestDTO {

    private UUID eventId;
    private String deviceType;

}
