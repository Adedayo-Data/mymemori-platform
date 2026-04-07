package com.mymemori.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PlanDto {

    private String plan;
    private List<String> benefits;
    private BigDecimal amount_USD;
    private BigDecimal amount_NGN;
}
