package com.mymemori.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaystackPaymentRequest {

    private String amount;
    private String reference;
    private String currency;
    private String callback_url;
    
}
