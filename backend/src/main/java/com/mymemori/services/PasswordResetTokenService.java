package com.mymemori.security;

import java.security.SecureRandom;
import java.util.Base64;

public class PasswordResetTokenService {

    // create token
    public String createToken(){
        byte[] bytes = new byte[32];
        new SecureRandom().nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    // validate token

    // consume token
}
