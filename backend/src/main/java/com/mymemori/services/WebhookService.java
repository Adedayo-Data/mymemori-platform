package com.mymemori.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mymemori.dto.WebhookRequest;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
// import org.aspectj.bridge.Message;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
// import java.util.Base64;
import java.util.HexFormat;
import java.util.Map;

@Service
@AllArgsConstructor
@Slf4j
public class WebhookService {

    private final ObjectMapper objectMapper;
    private final FlutterwaveProcessor flutterwaveProcessor;
    private final PaystackProcessor paystackProcessor;

    @Value("${flw.webhook.secret}")
    private final String secretHash;

    @Value("${ps.api.secret}")
    private final String psApiKey;

    public Boolean isValidFlwSignature(String rawData, String signature) {

        // This is for v4.0
        // try {
        // Mac mac = Mac.getInstance("HmacSHA256");
        // SecretKeySpec secretKey = new SecretKeySpec(
        // secretHash.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        // mac.init(secretKey);

        // // Mix the formulation with the raw data to get the hash
        // byte[] hmacBytes = mac.doFinal(
        // rawData.getBytes(StandardCharsets.UTF_8));

        // String computedSignature = Base64.getEncoder().encodeToString(hmacBytes);

        // return MessageDigest.isEqual(
        // computedSignature.getBytes(StandardCharsets.UTF_8),
        // signature.getBytes(StandardCharsets.UTF_8));
        // } catch (Exception e) {
        // return false;
        // }

        return secretHash.equals(signature);
    }

    public Boolean isValidPsSignature(String rawData, String signature) {

        try {
            Mac mac = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKey = new SecretKeySpec(psApiKey.getBytes(
                    StandardCharsets.UTF_8), "HmacSHA512");
            mac.init(secretKey);

            byte[] hmacBytes = mac.doFinal(
                    rawData.getBytes(StandardCharsets.UTF_8));

            String computedStringHash = HexFormat.of().formatHex(hmacBytes);

            return MessageDigest.isEqual(
                    computedStringHash.getBytes(StandardCharsets.UTF_8),
                    signature.getBytes(StandardCharsets.UTF_8));
        } catch (Exception e) {
            log.error("Error verifying Paystack signature", e);
            return false;
        }
    }

    // Process Webhook -> Queue for processing Flutterwave webhook(FW)
    @Async
    public void queueForProcessingFW(String data) {

        try {
            WebhookRequest webhook = objectMapper.readValue(data, WebhookRequest.class);
            if (!"charge.completed".equals(webhook.getEvent())) {
                log.info("Webhook not a payment complete webhook. Event: {}", webhook.getEvent());
                return;
            }

            String reference = (String) webhook.getData().get("tx_ref");
            flutterwaveProcessor.verifyTransaction(reference);
        } catch (Exception ex) {
            log.warn("An error occurred while deserializing Flutterwave webhook data. StackTrace: {}", ex.getMessage());
        }
    }

    // Process Webhook -> Queue for processing Paystack webhook (PW)
    @Async
    public void queueForProcessingPW(String data) {

        try {
            WebhookRequest webhook = objectMapper.readValue(data, WebhookRequest.class);
            if (!"charge.success".equals(webhook.getEvent())) {
                log.info("Webhook not a payment complete webhook. Event: {}", webhook.getEvent());
                return;
            }

            String reference = (String) webhook.getData().get("reference");
            paystackProcessor.verifyTransaction(reference);
        } catch (Exception e) {
            log.warn("An error occurred while deserializing Paystack webhook data. StackTrace: {}", e.getMessage());
        }
    }
}