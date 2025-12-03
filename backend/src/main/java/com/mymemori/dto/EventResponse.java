package com.mymemori.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class EventResponse {

    private String eventName;
    private LocalDate eventDate;
    private String location;
    private String description;
    private String eventSlug;
    private String imageUrl;

}
