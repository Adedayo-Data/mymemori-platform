package com.mymemori.dto;

import com.mymemori.models.PaymentType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentRequest {

    private UUID id;
    private PaymentType type;
    private String location;

}
