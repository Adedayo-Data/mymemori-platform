package com.mymemori.dto;

import com.mymemori.models.Photo;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class PhotoResponseDTO {

    private UUID photoId;
    private UUID eventId;
    private UUID sessionId;
    private UUID userId;
    private String imageUrl;

}
