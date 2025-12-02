package com.mymemori.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.Instant;
import java.util.Map;

@Data
@AllArgsConstructor
public class ErrorResponse {
    private int status;
    private String message;
    private Map<String, String> errors; // For validation errors
    private Instant timestamp;

    // Constructor for simple errors without field-specific validation errors
    public ErrorResponse(int status, String message, Instant timestamp) {
        this.status = status;
        this.message = message;
        this.errors = null;
        this.timestamp = timestamp;
    }
}
