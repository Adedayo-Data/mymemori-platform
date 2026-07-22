package com.mymemori.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class PhotoRequestDTO {

//    private UUID sessionId;

    @NotBlank(message = "eventSlug cannot be Blank")
    private String eventSlug;

    @NotEmpty(message = "List must not be Empty")
    private List<String> imageUrl;
}
