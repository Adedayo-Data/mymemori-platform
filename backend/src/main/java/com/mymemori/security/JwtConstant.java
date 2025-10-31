package com.mymemori.security;

import org.springframework.stereotype.Component;

@Component
public class JwtConstant {

    // @Value("${jwt-key}")
    public String JWTKEY = "128DTuErZA30SDGb5C3bRJr/HYkG5G6duPyaaPPUiVQ=";

    public static final String HEADER = "Authorization";

}
