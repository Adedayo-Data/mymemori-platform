package com.mymemori.dto;

import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class PhotoRequestDTO {

    private UUID sessionId;
    private UUID eventId;
    private List<String> imageUrl;
}
