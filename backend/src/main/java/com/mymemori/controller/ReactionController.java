package com.mymemori.controller;

import com.mymemori.dto.ReactionDeleteReq;
import com.mymemori.dto.ReactionRequestDTO;
import com.mymemori.dto.ReactionResponse;
import com.mymemori.services.ReactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/public/reaction")
@RequiredArgsConstructor
public class ReactionController {

    private final ReactionService reactionService;

    // save reactions
    @PostMapping("/react")
    public ResponseEntity<ReactionResponse> react(
            @Valid @RequestBody ReactionRequestDTO req,
            @RequestHeader(value = "X-Session-Id", required = false) UUID sessionId) {

        ReactionResponse response = reactionService.saveReactions(req, sessionId);

        if (response == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        return ResponseEntity.status(HttpStatus.ACCEPTED).body(response);
    }

    @DeleteMapping("/remove")
    public ResponseEntity<Void> deleteReaction(
            @Valid @RequestBody ReactionDeleteReq req,
            @RequestHeader(value = "X-Session-Id", required = false) UUID sessionId) {

        reactionService.deleteReactions(req, sessionId);
        return ResponseEntity.status(HttpStatus.ACCEPTED).build();
    }
}
