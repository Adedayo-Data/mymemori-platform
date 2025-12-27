package com.mymemori.dto;

import lombok.Data;

@Data
public class PaymentResponseResolver {

    private String status;
    private String message;
    private String referenceId;
    private String checkout_url;
}
