package com.mymemori.controller;

import com.mymemori.dto.PaymentRequest;
import com.mymemori.dto.PaymentResponseResolver;
import com.mymemori.services.LocationService;
import com.mymemori.services.PaymentProcessor;
import com.mymemori.services.WebhookService;
import com.mymemori.util.PaymentFactory;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/payment/")
@AllArgsConstructor
@Slf4j
public class PaymentController {

    private final LocationService locationService;
    private final PaymentFactory paymentFactory;
    private final WebhookService webhookService;

    @PostMapping("/initiate")
    public ResponseEntity<PaymentResponseResolver> initiatePayment(@RequestBody PaymentRequest payRequest, HttpServletRequest request){

        // fetch IP address from request
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)){
            ip = request.getRemoteAddr();
        }else{
            ip = ip.split(",")[0].trim();
        }

        if ("0:0:0:0:0:0:0:1".equals(ip)){
            ip = "127.0.0.1";
        }

        // IP - Country Resolver
        String country = locationService.getCountry(ip);

        // pass this to factory method to begin payment flow
        PaymentProcessor payProcessor = paymentFactory.fetchPaymentProcessor(country);

        PaymentResponseResolver paymentResponse = payProcessor.initializePayment(payRequest);

        return ResponseEntity.status(HttpStatus.OK).body(paymentResponse);

    }

    // Flutterwave Webhook
    @PostMapping("/flw/webhooks")
    public ResponseEntity<Void> flutterwaveWebhook(
            @RequestBody String rawPayload,
            @RequestHeader("flutterwave-signature") String signature)  {

        // verify the Signature
        if(!webhookService.isValidFlwSignature(rawPayload, signature)){
            log.warn("Signature not from Flutterwave. Signature: {}", signature);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // process the request if signature passed
        webhookService.queueForProcessingFW(rawPayload);

        return ResponseEntity.ok().build();
    }

    // Paystack Webhook
    @PostMapping("/ps/webhooks")
    public ResponseEntity<Void> paystackWebhook(
            @RequestBody String rawPayload,
            @RequestHeader("x-paystack-signature") String signature)  {

        // verify the Signature
        if(!webhookService.isValidPsSignature(rawPayload, signature)){
            log.warn("Signature not from Paystack. Signature: {}", signature);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // process the request if signature passed
        webhookService.queueForProcessingPW(rawPayload);

        return ResponseEntity.ok().build();
    }
}
