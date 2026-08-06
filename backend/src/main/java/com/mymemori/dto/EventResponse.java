package com.mymemori.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class EventResponse {

    private UUID id;
    private String eventName;
    private LocalDate eventDate;
    private String location;
    private String description;
    private String eventSlug;
    private String imageUrl;

}
