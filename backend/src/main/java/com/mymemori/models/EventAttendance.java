package com.mymemori.models;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Entity
@Data
public class EventAttendance {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    private UUID userId;
    private UUID eventId;

//    @Enumerated(EnumType.STRING)
    private AttendanceRole attendanceRole;
    private Instant joinedAt;

}
