package com.mymemori.controller;

import com.mymemori.dto.EventRequestDTO;
import com.mymemori.dto.EventResponse;
import com.mymemori.services.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/event")
public class EventController {

    @Autowired
    private EventService eventService;

    //Create Event
    @PostMapping("/create")
    public ResponseEntity<EventResponse> createEvent(@RequestBody EventRequestDTO requestDTO){
        EventResponse response = eventService.createEvent(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("event/{slug}")
    public ResponseEntity<EventResponse> findEventBySlug(@PathVariable String slug){
        EventResponse response = eventService.findByEventSlug(slug);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
