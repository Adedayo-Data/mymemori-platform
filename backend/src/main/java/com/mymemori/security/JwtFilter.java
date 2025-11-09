package com.mymemori.security;

import com.mymemori.services.MyUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    JwtService jwtService;

    @Autowired
    private MyUserDetailsService myUserDetailsService;

    public void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        System.out.println("Filter chain entered!");

        String token = "";
        String username = "";

        System.out.println("Token is: " + token);
        System.out.println("Username is: "+username);

        String authHeader = request.getHeader("Authorization");

        System.out.println("AUth header: " + authHeader);

        if(authHeader != null && authHeader.startsWith("Bearer ")){
            System.out.println("condition passed");
            token = authHeader.substring(7);
            username = jwtService.extractUsername(token);
        }

        System.out.println("username is: " + username);
        System.out.println("token is: " +token);
        if(!username.isEmpty() && SecurityContextHolder.getContext().getAuthentication() == null){
            // Validate the token
            System.out.println("Attempting to validate token!");
            System.out.println("Printing out the username: " + username);
            UserDetails userDetails = myUserDetailsService.loadUserByUsername(username);
            System.out.println("UserDetails Object: " + userDetails);

            if(jwtService.validateToken(token, userDetails)){

                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // set it in securityContextHolder
                SecurityContextHolder.getContext().setAuthentication(authToken);

                System.out.println("UserDetails role: "+ userDetails.getAuthorities());
            }

        }
        System.out.println("Leaving JwtFilter chain");
        filterChain.doFilter(request, response);
    }
}
