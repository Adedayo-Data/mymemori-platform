package com.mymemori.dto;

import lombok.Data;

@Data
public class AuthMessage {

    private String token;
    private String email;
    private String fullName;
    private String message;
}
