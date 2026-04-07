package com.mymemori.util;

import com.mymemori.exception.LocationNotFoundException;
import com.mymemori.services.FlutterwaveProcessor;
import com.mymemori.services.PaymentProcessor;
import com.mymemori.services.PaystackProcessor;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@AllArgsConstructor
public class PaymentFactory {

    private final PaystackProcessor paystackProcessor;
    private final FlutterwaveProcessor flutterwaveProcessor;


    public PaymentProcessor fetchPaymentProcessor(String country){
        log.info("Fetching payment processor");

        // handle null cases
        if (country == null || country.isEmpty()){
            log.warn("Country data is null or empty");
            throw new LocationNotFoundException("Location is null or empty!");
        }

        if ("NG".equals(country)){
            log.info("Nigeria Selected!");
            return paystackProcessor;
        }

        log.info("Other part of the world selected");
        return flutterwaveProcessor;
    }

//    public Transaction buildTransaction(PaymentResponse response){
//
//        Transaction transaction = Transaction.builder()
//                .set
//
//    }
}
