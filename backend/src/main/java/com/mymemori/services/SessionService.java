package com.mymemori.services;

import com.mymemori.Repository.SessionRepository;
import com.mymemori.dto.SessionRequestDTO;
import com.mymemori.dto.SessionResponseDTO;
import com.mymemori.models.Session;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class SessionService {

    private final SessionRepository sessionRepo;

    // create Session
    public SessionResponseDTO createSession(SessionRequestDTO req){

        Session session = new Session();

        session.setEventId(req.getEventId());
        session.setDeviceType(req.getDeviceType());
        session.setCreatedAt(Instant.now());
        session.setLastActiveAt(Instant.now());
        session.setTotalPhotosUploaded(0);
        session.setConvertedToUserId(null);

        Session savedSession = sessionRepo.save(session);

        return mapToDTO(savedSession);
    }

    public SessionResponseDTO mapToDTO(Session session){
        SessionResponseDTO response = new SessionResponseDTO();

        response.setSessionId(session.getId());
        response.setMessage("Session Created Successfully");

        return response;
    }
}
