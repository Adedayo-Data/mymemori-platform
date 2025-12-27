package com.mymemori.controller;

import com.mymemori.dto.PaymentRequest;
import com.mymemori.dto.PaymentResponse;
import com.mymemori.services.LocationService;
import com.mymemori.services.PaymentProcessor;
import com.mymemori.util.PaymentFactory;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/payment/")
@AllArgsConstructor
public class PaymentController {

    private final LocationService locationService;
    private final PaymentFactory paymentFactory;

    @PostMapping("/initiate")
    public ResponseEntity<PaymentResponse> initiatePayment(@RequestBody PaymentRequest payRequest, HttpServletRequest request){

        // fetch IP address from request
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)){
            request.getRemoteAddr();
        }else{
            ip.split(",")[0].trim();
        }

        if ("0:0:0:0:0:0:0:1".equals(ip)){
            ip = "127.0.0.1";
        }

        // Get Location of IP from Location Service
        String country = locationService.getCountry(ip);

        // pass this to factory method to begin payment flow
        PaymentProcessor payProcessor = paymentFactory.fetchPaymentProcessor(country);

        PaymentResponse paymentResponse = payProcessor.initializePayment(payRequest);

        return ResponseEntity.status(HttpStatus.OK).body(paymentResponse);

    }
}
