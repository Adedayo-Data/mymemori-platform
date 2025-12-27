package com.mymemori.util;

import java.security.SecureRandom;
import java.util.stream.Collectors;

public class ReferenceGenerator {
    // We exclude 'O', '0', '1', and 'I' to avoid user confusion
    private static final String CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final SecureRandom RANDOM = new SecureRandom();

    public static String generateRandomString(int length) {
        return RANDOM.ints(length, 0, CHARS.length())
                .mapToObj(CHARS::charAt)
                .map(Object::toString)
                .collect(Collectors.joining());
    }
}
