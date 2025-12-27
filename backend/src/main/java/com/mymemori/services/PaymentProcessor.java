package com.mymemori.services;

import com.mymemori.dto.PaymentRequest;
import com.mymemori.dto.PaymentResponse;
import com.mymemori.dto.PaymentResponseResolver;
import org.springframework.stereotype.Service;

@Service
public interface PaymentProcessor {

    PaymentResponseResolver initializePayment(PaymentRequest request);

    String getPaymentProcessor();
}
