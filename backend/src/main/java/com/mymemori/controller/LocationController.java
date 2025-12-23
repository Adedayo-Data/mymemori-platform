package com.mymemori.controller;

import com.mymemori.services.LocationService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@AllArgsConstructor
public class LocationController {

    private final LocationService locationService;

    @GetMapping("/client/ip")
    public ResponseEntity<Map<String, String>> getClientIP(HttpServletRequest request){
        String requestAddr = request.getHeader("X-Forwarded-For");
        if (requestAddr == null || requestAddr.isEmpty() || "unknown".equalsIgnoreCase(requestAddr)){
            requestAddr = request.getRemoteAddr();
        }else{
            requestAddr.split(",")[0].trim();
        }

        if ("0:0:0:0:0:0:0:1".equals(requestAddr)) {
            requestAddr = "127.0.0.1";
        }

        String country = locationService.getCountry(requestAddr);

        Map<String, String> response = new HashMap<>();
        response.put("Country", country);

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
