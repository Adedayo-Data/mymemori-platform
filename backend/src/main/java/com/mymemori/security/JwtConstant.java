package com.mymemori.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtConstant {

    @Value("${jwt.secret}")
    private String jwtKey;

    @Value("${jwt.expiration:86400000}") // Default: 24 hours
    private long expiration;

    public static final String HEADER = "Authorization";

    public String getJwtKey() {
        return jwtKey;
    }

    public long getExpiration() {
        return expiration;
    }
}
