package com.mymemori.util;

import com.mymemori.dto.PaymentResponse;
import com.mymemori.exception.LocationNotFoundException;
import com.mymemori.models.Transaction;
import com.mymemori.services.FlutterwaveProcessor;
import com.mymemori.services.PaymentProcessor;
import com.mymemori.services.PaystackProcessor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class PaymentFactory {

    public PaymentProcessor fetchPaymentProcessor(String country){
        log.info("Fetching payment processor");

        // handle null cases
        if (country == null || country.isEmpty()){
            log.warn("Country data is null or empty");
            throw new LocationNotFoundException("Location is null or empty!");
        }

        if ("NG".equals(country)){
            log.info("Nigeria Selected!");
            return new PaystackProcessor();
        }

        log.info("Other part of the world selected");
        return new FlutterwaveProcessor();
    }

//    public Transaction buildTransaction(PaymentResponse response){
//
//        Transaction transaction = Transaction.builder()
//                .set
//
//    }
}
