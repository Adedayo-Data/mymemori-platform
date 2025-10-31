package com.mymemori.services;

import com.mymemori.Repository.EventRepository;
import com.mymemori.dto.EventRequestDTO;
import com.mymemori.dto.EventResponse;
import com.mymemori.models.Event;
import com.mymemori.models.Users;
import com.mymemori.util.AuthenticatedUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Random;

@Service
public class EventService {

    @Autowired
    private AuthenticatedUser authUser;

    @Autowired
    private EventRepository eventRepo;

    // create Event
    public EventResponse createEvent(@RequestBody EventRequestDTO request){

        // fetch authenticated User
        Users user = authUser.fetchAuthenticatedUser();

        // build Event
        Event newEvent = new Event();
        newEvent.setHostId(user.getId());
        newEvent.setEventName(request.getEventName());
        newEvent.setEventDate(request.getEventDate());
        newEvent.setLocation(request.getLocation());
        newEvent.setDescription(request.getDescription());
        newEvent.setEventSlug(generateEventSlug());

        Event savedEvent = eventRepo.save(newEvent);

        // Map to Response
        EventResponse response = new EventResponse();
        response.setEventName(savedEvent.getEventName());
        response.setEventDate(savedEvent.getEventDate());
        response.setLocation(savedEvent.getLocation());
        response.setDescription(savedEvent.getDescription());
        response.setEventSlug(savedEvent.getEventSlug());

        return response;
    }

    private String generateEventSlug(){
        String chars = "abcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder sb = new StringBuilder();
        java.util.Random random = new Random();
        for(int i = 0; i<6; i++){
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }
}
