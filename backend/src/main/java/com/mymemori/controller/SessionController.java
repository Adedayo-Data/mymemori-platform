package com.mymemori.controller;

import com.mymemori.dto.SessionRequestDTO;
import com.mymemori.dto.SessionResponseDTO;
import com.mymemori.services.SessionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class SessionController {

    private final SessionService sessionService;
    // create Session
    @PostMapping("/create-session")
    public ResponseEntity<SessionResponseDTO> createSession(@Valid @RequestBody SessionRequestDTO request){

        SessionResponseDTO response = sessionService.createSession(request);

        if(response == null){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
