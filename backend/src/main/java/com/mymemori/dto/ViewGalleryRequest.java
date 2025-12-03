package com.mymemori.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.UUID;

@Data
public class ViewGalleryRequest {

    public UUID sessionId;

    @NotBlank(message = "Event slug is absent")
    public String eventSlug;

}
