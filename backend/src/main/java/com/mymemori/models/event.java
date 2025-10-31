package com.mymemori.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
public class event {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private Long host_id; // Gotten from user_id
    private String event_name;
    private String event_slug;

    private Instant created_at;
}
