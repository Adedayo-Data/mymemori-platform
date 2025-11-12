package com.mymemori.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class HealthController {


    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck(){
        Map<String, String> response = new HashMap<>();

        response.put("Status", "UP");
        response.put("Sevice", "MyMemori App");

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
