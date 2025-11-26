package com.mymemori.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.UUID;

@Data
public class SessionRequestDTO {

    @NotBlank(message = "Event slug cannot be missing")
    private String eventSlug;
    private String deviceType;

}
