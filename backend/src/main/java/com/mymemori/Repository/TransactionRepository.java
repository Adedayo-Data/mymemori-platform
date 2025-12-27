package com.mymemori.Repository;

import com.mymemori.models.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, UUID> {

    @Override
    Optional<Transaction> findById(UUID uuid);

    Optional<Transaction> findTransactionByProviderReference(String reference);
}
