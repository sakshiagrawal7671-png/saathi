package com.saathi.controller;

import com.saathi.dto.request.GratitudeRequest;
import com.saathi.dto.response.ApiResponse;
import com.saathi.entity.GratitudeEntry;
import com.saathi.repository.UserRepository;
import com.saathi.service.GratitudeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/gratitude")
@RequiredArgsConstructor
public class GratitudeController {

    private final GratitudeService gratitudeService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<GratitudeEntry>> add(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody GratitudeRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Gratitude added", gratitudeService.addGratitude(getUserId(userDetails), request)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<GratitudeEntry>>> getAll(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(gratitudeService.getGratitudes(getUserId(userDetails))));
    }

    @GetMapping("/garden")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getGarden(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(gratitudeService.getGardenStats(getUserId(userDetails))));
    }

    private Long getUserId(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername()).orElseThrow().getId();
    }
}
