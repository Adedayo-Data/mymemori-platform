package com.mymemori.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Data
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private UUID hostId; // Gotten from user_id
    private String eventName;
    private LocalDate eventDate;
    private String location;
    private String description;
    private String eventSlug; // unique
    private String imageUrl;

    @CreationTimestamp
    private Instant created_at;
}
