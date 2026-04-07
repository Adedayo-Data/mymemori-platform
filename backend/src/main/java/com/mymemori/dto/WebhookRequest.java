package com.mymemori.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
public class WebhookRequest {

    private Map<String, Object> data;
    private String event; // Paystack event type Fluttterwave uses this in v3.0
    // private String type; // Flutterwave event type

}
