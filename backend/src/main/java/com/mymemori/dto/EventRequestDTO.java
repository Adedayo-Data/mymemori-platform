package com.mymemori.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class EventRequestDTO {

    private String eventName;
    private LocalDate eventDate;
    private String location;
    private String description;

}
