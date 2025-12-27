package com.mymemori.dto;

import jakarta.annotation.Nullable;
import lombok.*;

import java.math.BigDecimal;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FlutterPaymentRequest{


    private BigDecimal amount;
    private String tx_ref;
    private String currency;
    private String redirect_url;


    private FlutterUserDto customer;
    private FlutterCustomization customization;
    private String payment_options; // Ensure you add payment methods that people abroad can use to make payment

}
