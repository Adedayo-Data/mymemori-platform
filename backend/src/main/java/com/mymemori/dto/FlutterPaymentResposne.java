package com.mymemori.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FlutterPaymentResposne {

    private String status;
    private String message;
    private Map<String, String> data;

}
