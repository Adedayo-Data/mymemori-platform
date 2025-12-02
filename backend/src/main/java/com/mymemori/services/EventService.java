package com.mymemori.services;

import com.mymemori.Repository.EventRepository;
import com.mymemori.dto.EventRequestDTO;
import com.mymemori.dto.EventResponse;
import com.mymemori.exception.EventNotFoundException;
import com.mymemori.exception.UserNotFoundException;
import com.mymemori.models.Event;
import com.mymemori.models.Users;
import com.mymemori.util.AuthenticatedUser;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@Service
@Slf4j
public class EventService {

    @Autowired
    private AuthenticatedUser authUser;

    @Autowired
    private EventRepository eventRepo;

    // create Event
    public EventResponse createEvent(@RequestBody EventRequestDTO request) {
        // fetch authenticated User
        Users user = authUser.fetchAuthenticatedUser();
        log.info("Creating event for user: {}", user.getEmail());

        // build Event
        Event newEvent = new Event();
        newEvent.setHostId(user.getId());
        newEvent.setEventName(request.getEventName());
        newEvent.setEventDate(request.getEventDate());
        newEvent.setLocation(request.getLocation());
        newEvent.setDescription(request.getDescription());
        newEvent.setEventSlug(generateEventSlug());
        newEvent.setImageUrl(request.getImageUrl());

        Event savedEvent = eventRepo.save(newEvent);
        log.info("Event created successfully: eventId={}, slug={}", savedEvent.getId(), savedEvent.getEventSlug());

        // Map to Response
        return mapToDto(savedEvent);
    }

    // get all events for a user
    public List<EventResponse> getAllEvent() {
        Users user = authUser.fetchAuthenticatedUser();

        if (user == null) {
            throw new UserNotFoundException("User not found");
        }

        log.debug("Fetching all events for user: {}", user.getId());
        List<EventResponse> allEvent = new ArrayList<>();
        List<Event> dbEvents = eventRepo.findByHostId(user.getId());

        for (Event e : dbEvents) {
            EventResponse response = mapToDto(e);
            allEvent.add(response);
        }
        log.info("Retrieved {} events for user: {}", allEvent.size(), user.getId());
        return allEvent;
    }

    // find By Event Slug
    public EventResponse findByEventSlug(String slug) {
        log.debug("Finding event by slug: {}", slug);
        Event event = eventRepo.findByEventSlug(slug);
        if (event == null) {
            throw new EventNotFoundException("Event not found with slug: " + slug);
        }

        // Map event to DTO
        EventResponse eventResponse = new EventResponse();
        eventResponse.setEventName(event.getEventName());
        eventResponse.setEventDate(event.getEventDate());
        eventResponse.setLocation(event.getLocation());
        eventResponse.setDescription(event.getDescription());
        eventResponse.setEventSlug(event.getEventSlug());
        eventResponse.setImageUrl(event.getImageUrl());

        return eventResponse;
    }

    private String generateEventSlug() {
        String chars = "abcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder sb = new StringBuilder();
        java.util.Random random = new Random();
        for (int i = 0; i < 6; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }

    // get Event by ID
    public EventResponse getEventById(UUID eventId) {
        log.debug("Finding event by ID: {}", eventId);
        Event event = eventRepo.findById(eventId)
                .orElseThrow(() -> new EventNotFoundException("Event not found with ID: " + eventId));
        return mapToDto(event);
    }

    // ======================= UTIL METHOD =================
    public EventResponse mapToDto(Event event) {

        EventResponse response = new EventResponse();
        response.setEventName(event.getEventName());
        response.setEventDate(event.getEventDate());
        response.setLocation(event.getLocation());
        response.setDescription(event.getDescription());
        response.setEventSlug(event.getEventSlug());
        response.setImageUrl(event.getImageUrl());

        return response;
    }
}
