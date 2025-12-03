package com.mymemori.security;

import com.mymemori.services.MyUserDetailsService;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@Slf4j
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    JwtService jwtService;

    @Autowired
    private MyUserDetailsService myUserDetailsService;

    public void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        log.info("Filter chain entered!");

        String token = "";
        String username = "";

        String authHeader = request.getHeader("Authorization");

        log.info("Auth Header at this point is {}", authHeader);

        if(authHeader != null && authHeader.startsWith("Bearer ")){
            try{
                log.info("Condition passed. Auth header not null and Auth header begins with Bearer");
                token = authHeader.substring(7);
                username = jwtService.extractUsername(token);

                log.info("Username from token is {}", username);
                log.info("token is: {}", token);

                if(!username.isEmpty() && SecurityContextHolder.getContext().getAuthentication() == null){
                    // Validate the token
                    log.info("Attempting to validate token!");
                    UserDetails userDetails = myUserDetailsService.loadUserByUsername(username);

                    if(jwtService.validateToken(token, userDetails)){

                        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                        // set it in securityContextHolder
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                    }
                }
            }catch(ExpiredJwtException ex){
                log.warn("JWT Expired with error: {}", ex.getMessage());
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("JWT expired!");
                return;
            }catch (Exception e){
                logger.warn("An unknow error occured: ", e.getCause());
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("An unknown error occured");
                return;
            }
        }
        log.info("Leaving JwtFilter chain");
        filterChain.doFilter(request, response);
    }
}
