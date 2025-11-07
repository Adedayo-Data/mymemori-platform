package com.mymemori.controller;

import com.mymemori.dto.PhotoRequestDTO;
import com.mymemori.dto.PhotoResponseDTO;
import com.mymemori.services.PhotoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PhotoController {

    private final PhotoService photoService;

    // save photos
    @PostMapping("/save-image")
    public ResponseEntity<List<PhotoResponseDTO>> savePhotos(@RequestBody PhotoRequestDTO request){
        List<PhotoResponseDTO> response = photoService.savePhoto(request);

        if (response.isEmpty()){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    //TO FIX: Implement the strategy by which images are loaded back to the list. For now UI should randomize output
}
