package com.mymemori.services;

import com.mymemori.Repository.EventAttendanceRepository;
import com.mymemori.models.AttendanceRole;
import com.mymemori.models.EventAttendance;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class EventAttendanceService {

    private final EventAttendanceRepository attendanceRepo;

    /**
     * Mark user as attendee of an event (auto-called when uploading photo)
     * Only creates attendance record if one doesn't exist
     */
    @Transactional
    public void markAttendance(UUID eventId, UUID userId) {
        if (userId == null || eventId == null) {
            log.warn("Cannot mark attendance: userId or eventId is null");
            return;
        }

        // Check if already attended
        if (attendanceRepo.existsByEventIdAndUserId(eventId, userId)) {
            log.debug("User {} already marked as attendee for event {}", userId, eventId);
            return;
        }

        // Create attendance record
        EventAttendance attendance = new EventAttendance();
        attendance.setEventId(eventId);
        attendance.setUserId(userId);
        attendance.setJoinedAt(Instant.now());
        attendance.setAttendanceRole(AttendanceRole.ATTENDEE);

        attendanceRepo.save(attendance);
        log.info("Marked user {} as attendee for event {}", userId, eventId);
    }

    /**
     * Get all events attended by a user
     */
    public List<EventAttendance> getUserAttendedEvents(UUID userId) {
        return attendanceRepo.findByUserIdOrderByJoinedAtDesc(userId);
    }

    /**
     * Get all attendees for an event
     */
    public List<EventAttendance> getEventAttendees(UUID eventId) {
        return attendanceRepo.findByEventId(eventId);
    }

    /**
     * Get attendance count for an event
     */
    public long getAttendanceCount(UUID eventId) {
        return attendanceRepo.countByEventId(eventId);
    }
}
