package com.mymemori.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class GoogleAuthRequest {

    /** The credential/id_token returned by Google's Sign In with Google button. */
    @NotBlank(message = "Google ID token is required")
    private String idToken;

    /** Optional: session ID to convert guest data to user upon sign-in/up */
    private UUID sessionId;
}
