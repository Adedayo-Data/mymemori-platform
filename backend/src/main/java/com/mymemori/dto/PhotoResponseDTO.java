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
    private boolean canDelete;
    private String imageUrl;
    private Integer reactionCount;
    private Boolean isLikedByCurrentUser;

}
