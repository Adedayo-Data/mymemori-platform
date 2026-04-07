package com.mymemori.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PlanDtoResponse {

    private UUID id;
    private String plan;
    private List<String> benefits;
    private String currency;
    private BigDecimal amount;

}
