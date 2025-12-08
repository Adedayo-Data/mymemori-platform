package com.mymemori.controller;

import com.mymemori.Repository.EventRepository;
import com.mymemori.dto.EventResponse;
import com.mymemori.models.Event;
import com.mymemori.models.EventAttendance;
import com.mymemori.models.Users;
import com.mymemori.services.EventAttendanceService;
import com.mymemori.util.AuthenticatedUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
@Slf4j
public class EventAttendanceController {

    private final EventAttendanceService attendanceService;
    private final EventRepository eventRepo;
    private final AuthenticatedUser authUser;

    /**
     * Get all events attended by the current user
     */
    @GetMapping("/my-events")
    public ResponseEntity<List<EventResponse>> getMyAttendedEvents() {
        Users user = authUser.fetchAuthenticatedUser();

        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        List<EventAttendance> attendances = attendanceService.getUserAttendedEvents(user.getId());
        List<EventResponse> events = new ArrayList<>();

        for (EventAttendance attendance : attendances) {
            Event event = eventRepo.findById(attendance.getEventId()).orElse(null);
            if (event != null) {
                EventResponse response = new EventResponse();
                response.setEventName(event.getEventName());
                response.setEventDate(event.getEventDate());
                response.setLocation(event.getLocation());
                response.setDescription(event.getDescription());
                response.setEventSlug(event.getEventSlug());
                response.setImageUrl(event.getImageUrl());
                events.add(response);
            }
        }

        log.info("Returning {} attended events for user {}", events.size(), user.getId());
        return ResponseEntity.ok(events);
    }
}
