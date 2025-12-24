package com.mymemori.Repository;

import com.mymemori.models.Plans;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PlansRepository extends JpaRepository<Plans, UUID> {

    Optional<Plans> findById(UUID planId);
}
