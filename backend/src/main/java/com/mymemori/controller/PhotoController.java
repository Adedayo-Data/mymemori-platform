package com.mymemori.controller;

import com.mymemori.dto.PhotoRequestDTO;
import com.mymemori.dto.PhotoResponseDTO;
import com.mymemori.dto.ViewGalleryRequest;
import com.mymemori.services.PhotoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PhotoController {

    private final PhotoService photoService;

    // save photos
    @PostMapping("/save-image")
    public ResponseEntity<List<PhotoResponseDTO>> savePhotos(
            @RequestHeader("sessionId") UUID sessionId,
            @RequestBody PhotoRequestDTO request){

        System.out.println("Gallery Entered!");

        List<PhotoResponseDTO> response = photoService.savePhoto(request, sessionId);

        if (response.isEmpty()){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    //TO FIX: Implement the strategy by which images are loaded back to the list. For now UI should randomize output

    // Initial Gallery Call
    // FOMO strategy
    @GetMapping("/images")
    public ResponseEntity<List<PhotoResponseDTO>> findFiveImage(
            @RequestBody ViewGalleryRequest request,
            @RequestHeader("sessionId") UUID sessionId){
        List<PhotoResponseDTO> response = photoService.getOnlyTen(request, sessionId);

        return ResponseEntity.status(HttpStatus.ACCEPTED).body(response);
    }
}
