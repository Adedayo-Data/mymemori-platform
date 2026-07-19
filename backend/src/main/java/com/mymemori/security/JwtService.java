package com.mymemori.security;

import com.mymemori.models.Users;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    @Autowired
    JwtConstant constant;

    private final SecretKey signingKey = Keys.hmacShaKeyFor(
            constant.getJwtKey().getBytes(StandardCharsets.UTF_8)
    );

    public String generateToken(Users users) {

        Map<String, String> claim = new HashMap<>();
        claim.put("fullName", users.getFullName());
        claim.put("role", users.getRole().name());
        return Jwts.builder()
                .subject(users.getEmail())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + constant.getExpiration()))
                .claims(claim)
                .signWith(signingKey, Jwts.SIG.HS256)
                .compact();
    } // end Generate token

    // validate the token
    public Claims getAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(Keys.hmacShaKeyFor(constant.getJwtKey().getBytes()))
                .build()
                .parseSignedClaims(token) // Meaning: with the verified key check this claim
                .getPayload();
    }// end getAllClaims

    // get token payload data
    public <T> T getClaim(String token, Function<Claims, T> claimsFunction) {
        Claims claims = getAllClaims(token);
        return claimsFunction.apply(claims);
    }// end getClaims

    public String extractUsername(String token) {
        return getClaim(token, Claims::getSubject);
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        return extractUsername(token).equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractTokenExpiry(token).before(new Date());
    }

    private Date extractTokenExpiry(String token) {
        return getClaim(token, Claims::getExpiration);
    }

}
