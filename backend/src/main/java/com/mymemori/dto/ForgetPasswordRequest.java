package com.mymemori.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ForgetPasswordRequest {

    @Email
    @NotBlank
    @NotNull(message = "Your mail is required")
    private String email;
}
