package com.mymemori.Repository;

import com.mymemori.models.EventAttendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EventAttendanceRepository extends JpaRepository<EventAttendance, UUID> {

    // Check if user has already attended an event
    boolean existsByEventIdAndUserId(UUID eventId, UUID userId);

    // Get all events attended by a user
    List<EventAttendance> findByUserIdOrderByJoinedAtDesc(UUID userId);

    // Get all attendees for an event
    List<EventAttendance> findByEventId(UUID eventId);

    // Find specific attendance record
    Optional<EventAttendance> findByEventIdAndUserId(UUID eventId, UUID userId);

    // Count attendees for an event
    long countByEventId(UUID eventId);

    // Session-based attendance methods
    boolean existsByEventIdAndSessionId(UUID eventId, UUID sessionId);

    Optional<EventAttendance> findByEventIdAndSessionId(UUID eventId, UUID sessionId);

    List<EventAttendance> findBySessionId(UUID sessionId);
}
