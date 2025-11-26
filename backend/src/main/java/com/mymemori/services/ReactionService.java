package com.mymemori.services;

import com.mymemori.Repository.ReactionRepository;
import com.mymemori.dto.ReactionDeleteReq;
import com.mymemori.dto.ReactionRequestDTO;
import com.mymemori.dto.ReactionResponse;
import com.mymemori.models.Reactions;
import com.mymemori.models.Users;
import com.mymemori.util.AuthenticatedUser;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReactionService {

    private final ReactionRepository reactionRepo;
    private final AuthenticatedUser authUser;

    // save reactions
    // FE must always check if jwt exist and do the expected
    public ReactionResponse saveReactions(ReactionRequestDTO request, UUID sessionId){

        Users user = authUser.fetchAuthenticatedUser();

        if (user == null && sessionId == null) {
            throw new IllegalArgumentException("User must be authenticated with valid JWT or contain sessionID in header");
        }

        Reactions reactions = new Reactions();

        reactions.setPhotoId(request.getPhotoId());
        reactions.setSessionId(sessionId);
        reactions.setUserId(user.getId());
        reactions.setReactedAt(request.getReactedAt());

        return mapToDTO(reactions);
    }

    public ReactionResponse mapToDTO(Reactions reactions){
        ReactionResponse response = new ReactionResponse();

        response.setPhotoId(reactions.getUserId());
        response.setUserId(reactions.getUserId());
        response.setSessionId(reactions.getSessionId());
        response.setImageReactionCount(photoReactionCount());

        return response;
    }

    public Long photoReactionCount(){
        return reactionRepo.count();
    }

    // delete reactions
    public void deleteReactions(ReactionDeleteReq req, UUID sessionId){

        Users user = authUser.fetchAuthenticatedUser();

        if(user == null && sessionId ==null){
            throw new IllegalArgumentException("User must be authenticated with valid JWT or contain sessionID in header");
        }

        if (user == null){
            Long deletionCount = reactionRepo.deleteByPhotoIdAndSessionId(req.getPhotoId(), sessionId);
            System.out.println("Deleted based on session id. Count is: " +deletionCount); // TO FIX: This was made simple for now. To improve logs later
        }else {
            Long deletionCount = reactionRepo.deleteByPhotoIdAndUserId(req.getPhotoId(), user.getId());
            System.out.println("Deleted based on session id. Count is: " + deletionCount);
        }


    }
}
