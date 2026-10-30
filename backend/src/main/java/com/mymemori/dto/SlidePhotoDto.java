package com.mymemori.dto;

import java.time.Instant;
import java.util.UUID;

public record SlidePhotoDto(UUID photoId, String imageUrl, Instant uploadedAt) {}
