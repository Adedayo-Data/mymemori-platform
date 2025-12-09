package com.mymemori.controller;

import com.mymemori.Repository.UserRepository;
import com.mymemori.dto.AuthMessage;
import com.mymemori.dto.LoginRequest;
import com.mymemori.dto.UserRequestDTO;
import com.mymemori.exception.EmailAlreadyExistsException;
import com.mymemori.exception.InvalidCredentialsException;
import com.mymemori.models.Users;
import com.mymemori.security.JwtService;
import com.mymemori.services.SessionConversionService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@Slf4j
public class AuthController {

    @Autowired
    private PasswordEncoder passEncoder;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private SessionConversionService sessionConversionService;

    @PostMapping("/sign-up")
    public ResponseEntity<AuthMessage> register(@Valid @RequestBody UserRequestDTO request) {
        log.info("User registration attempt for email: {}", request.getEmail());

        // Check if email already exists
        if (userRepo.findByEmail(request.getEmail()) != null) {
            throw new EmailAlreadyExistsException("Email already registered");
        }

        Users user = new Users();
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setPassword(passEncoder.encode(request.getPassword()));

        // Store original session ID if provided (for session conversion)
        if (request.getSessionId() != null) {
            user.setOriginalSessionId(request.getSessionId());
            log.info("Session conversion requested: sessionId={}", request.getSessionId());
        }

        // save user
        Users savedUser = userRepo.save(user);
        log.info("User registered successfully: userId={}, email={}", savedUser.getId(), savedUser.getEmail());

        // Convert session data to user data if session ID was provided
        if (request.getSessionId() != null) {
            try {
                sessionConversionService.convertSessionToUser(request.getSessionId(), savedUser.getId());
                log.info("Session data converted successfully for userId={}", savedUser.getId());
            } catch (Exception e) {
                log.error("Failed to convert session data for userId={}, sessionId={}",
                        savedUser.getId(), request.getSessionId(), e);
                // Don't fail the signup, just log the error
            }
        }

        // generate JWT
        String token = jwtService.generateToken(savedUser);

        // Map to AuthMessage
        AuthMessage message = new AuthMessage();
        message.setEmail(savedUser.getEmail());
        message.setToken(token);
        message.setFullName(savedUser.getFullName());
        message.setMessage("Sign-up Successful");

        return ResponseEntity.status(HttpStatus.CREATED).body(message);
    }

    // sign in
    @PostMapping("/sign-in")
    public ResponseEntity<AuthMessage> Login(@Valid @RequestBody LoginRequest request) {
        log.info("User login attempt for email: {}", request.getEmail());

        // check if user Exist in the db
        Users user = userRepo.findByEmail(request.getEmail());

        if (user == null || !passEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid credentials");
        }

        // generate token
        String token = jwtService.generateToken(user);
        log.info("User logged in successfully: userId={}", user.getId());

        // Map to AuthMessage
        AuthMessage message = new AuthMessage();
        message.setEmail(user.getEmail());
        message.setToken(token);
        message.setFullName(user.getFullName());
        message.setMessage("Sign-in Successful");

        return ResponseEntity.status(HttpStatus.OK).body(message);
    }
}
