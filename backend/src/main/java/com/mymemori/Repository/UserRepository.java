package com.mymemori.Repository;

import com.mymemori.models.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<Users, UUID> {

    Users findByEmail(String mail);

    Users findByGoogleId(String googleId);
}
