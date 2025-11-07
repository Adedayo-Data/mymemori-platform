package com.mymemori.Repository;

import com.mymemori.models.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface EventRepository extends JpaRepository<Event, UUID> {
    Event findByEventSlug(String eventSlug);
}
