package com.mymemori.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class EventRequestDTO {

    @NotBlank(message = "Event name is required")
    @Size(min = 3, max = 255, message = "Event name must be between 3 and 255 characters")
    private String eventName;

    @NotNull(message = "Event date is required")
    @Future(message = "Event date must be in the future")
    private LocalDate eventDate;

    @Size(max = 255, message = "Location is too long")
    private String location;

    @Size(max = 1000, message = "Description is too long")
    private String description;

    @Size(max = 500, message = "Image URL is too long")
    private String imageUrl;
}
