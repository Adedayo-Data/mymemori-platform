package com.mymemori.controller;

import com.mymemori.dto.EventRequestDTO;
import com.mymemori.dto.EventResponse;
import com.mymemori.dto.EventUpdateDTO;
import com.mymemori.services.EventService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/event")
public class EventController {

    @Autowired
    private EventService eventService;

    // Create Event
    @PostMapping("/create")
    public ResponseEntity<EventResponse> createEvent(@Valid @RequestBody EventRequestDTO requestDTO) {
        EventResponse response = eventService.createEvent(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Get All events for authenticated user
    @GetMapping
    public ResponseEntity<List<EventResponse>> getAllEvent() {
        List<EventResponse> events = eventService.getAllEvent();
        return ResponseEntity.ok(events);
    }

    // Get event by id
    @GetMapping("/id/{id}")
    public ResponseEntity<EventResponse> getEventById(@PathVariable UUID id) {
        EventResponse event = eventService.getEventById(id);
        return ResponseEntity.ok(event);
    }

    // Get event by slug
    @GetMapping("/{slug}")
    public ResponseEntity<EventResponse> findEventBySlug(@PathVariable String slug) {
        EventResponse response = eventService.findByEventSlug(slug);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    /**
     * Update an existing event.
     * Only the authenticated host of the event may call this endpoint.
     */
    @PutMapping("/{id}")
    public ResponseEntity<EventResponse> updateEvent(
            @PathVariable UUID id,
            @Valid @RequestBody EventUpdateDTO requestDTO) throws AccessDeniedException {
        EventResponse response = eventService.updateEvent(id, requestDTO);
        return ResponseEntity.ok(response);
    }

    /**
     * Delete an event and all of its associated photos.
     * Only the authenticated host of the event may call this endpoint.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable UUID id) throws AccessDeniedException {
        eventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }
}

