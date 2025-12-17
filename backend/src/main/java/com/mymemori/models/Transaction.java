package com.mymemori.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentPurpose purpose;

    @Column(nullable = false)
    private BigDecimal amount;
    private String currency; // This would be determined based off of location

    @ManyToOne(cascade = CascadeType.ALL) // such that when you delete a user their transaction goes too
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private Users user;

    // An event can have multiple payment done for it
    @ManyToOne
    @JoinColumn(name = "event_id", referencedColumnName = "id")
    private Event event;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentProvider paymentProvider;

    @Column(nullable = false)
    private String providerReference;

    @CreationTimestamp
    private Instant createdAt;

}
