package com.mymemori.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentResponse {

    private String status;
    private String message;
    private Map<String, Object> data;
}
