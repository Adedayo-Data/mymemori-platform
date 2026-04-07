package com.mymemori.services;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Service
@AllArgsConstructor
@Slf4j
public class LocationService{

    private final RestTemplate restTemplate;

    public String getCountry(String ip){

        if(ip == null || ip.isBlank() || "127.0.0.1".equals(ip)){
            log.warn("IP cannot be parsed for IP: {}, defaulting to international payment", ip);
            return "UNKNOWN";
        }

        String url = "https://api.country.is/" + ip;

        try{
            LocationResponse response = restTemplate.getForObject(url, LocationResponse.class);
            return response !=null && response.country != null ? response.country : "UNKNOWN";
        } catch (RestClientException e) {
            log.warn("Geolocation failed for IP: {}", ip, e);
            return "UNKNOWN";
        }
    }

    public record LocationResponse(String ip, String country){}
}