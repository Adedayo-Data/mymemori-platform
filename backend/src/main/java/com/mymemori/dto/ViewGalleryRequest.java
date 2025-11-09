package com.mymemori.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class ViewGalleryRequest {

    public UUID sessionId;
    public String eventSlug;

}
