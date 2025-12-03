package com.mymemori.controller;

import com.mymemori.dto.ReactionDeleteReq;
import com.mymemori.dto.ReactionRequestDTO;
import com.mymemori.dto.ReactionResponse;
import com.mymemori.services.ReactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public/reaction")
@RequiredArgsConstructor
public class ReactionController {

    private final ReactionService reactionService;

    // save reactions
    @PostMapping("/react")
    public ResponseEntity<ReactionResponse> react(@RequestBody ReactionRequestDTO req){

        ReactionResponse response = reactionService.saveReactions(req);
        if (response == null){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        return ResponseEntity.status(HttpStatus.ACCEPTED).body(response);
    }

    @DeleteMapping("/remove")
    public ResponseEntity<Void> deleteReaction(ReactionDeleteReq req){
        reactionService.deleteReactions(req);
        return ResponseEntity.status(HttpStatus.ACCEPTED).build();
    }
}
