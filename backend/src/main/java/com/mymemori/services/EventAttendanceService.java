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

    /**
     * Mark session user as attendee of an event
     * Used for tracking session users before they sign up
     */
    @Transactional
    public void markSessionAttendance(UUID eventId, UUID sessionId) {
        if (sessionId == null || eventId == null) {
            log.warn("Cannot mark session attendance: sessionId or eventId is null");
            return;
        }

        // Check if already attended
        if (attendanceRepo.existsByEventIdAndSessionId(eventId, sessionId)) {
            log.debug("Session {} already marked as attendee for event {}", sessionId, eventId);
            return;
        }

        // Create attendance record
        EventAttendance attendance = new EventAttendance();
        attendance.setEventId(eventId);
        attendance.setSessionId(sessionId);
        attendance.setUserId(null); // No user yet
        attendance.setJoinedAt(Instant.now());
        attendance.setAttendanceRole(AttendanceRole.ATTENDEE);

        attendanceRepo.save(attendance);
        log.info("Marked session {} as attendee for event {}", sessionId, eventId);
    }

    /**
     * Migrate session attendance to user attendance when session user signs up
     * Handles duplicates: if user already attended event, deletes session record
     */
    @Transactional
    public void migrateSessionAttendance(UUID sessionId, UUID userId) {
        if (sessionId == null || userId == null) {
            log.warn("Cannot migrate attendance: sessionId or userId is null");
            return;
        }

        // Find all session attendance records
        List<EventAttendance> sessionAttendances = attendanceRepo.findBySessionId(sessionId);

        if (sessionAttendances.isEmpty()) {
            log.debug("No session attendance to migrate for session {}", sessionId);
            return;
        }

        for (EventAttendance attendance : sessionAttendances) {
            // Check if user already has attendance for this event
            if (attendanceRepo.existsByEventIdAndUserId(attendance.getEventId(), userId)) {
                // User already attended (maybe uploaded before), delete session record
                attendanceRepo.delete(attendance);
                log.debug("Deleted duplicate session attendance for event {}", attendance.getEventId());
            } else {
                // Migrate: update sessionId record to userId
                attendance.setUserId(userId);
                attendance.setSessionId(null);
                attendanceRepo.save(attendance);
                log.info("Migrated session attendance to user {} for event {}", userId, attendance.getEventId());
            }
        }

        log.info("Completed migration of {} session attendance records for user {}",
                sessionAttendances.size(), userId);
    }
}
