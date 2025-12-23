package com.mymemori.services;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Service
@AllArgsConstructor
public class LocationService{

    private final RestTemplate restTemplate;

    public String getCountry(String ip){

        String url = "https://api.country.is/" + ip;

        try{
            LocationResponse response = restTemplate.getForObject(url, LocationResponse.class);
            return response !=null ? response.country : null;
        } catch (RestClientException e) {
            throw new RuntimeException(e);
        }
    }

    public record LocationResponse(String ip, String country){}
}