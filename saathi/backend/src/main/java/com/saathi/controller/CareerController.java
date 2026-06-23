package com.saathi.controller;

import com.saathi.dto.response.ApiResponse;
import com.saathi.entity.CareerGuidance;
import com.saathi.repository.UserRepository;
import com.saathi.service.CareerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/career")
@RequiredArgsConstructor
public class CareerController {

    private final CareerService careerService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getGuidance(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(
                careerService.getFullGuidance(getUserId(userDetails))));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<CareerGuidance>> update(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> fields) {
        return ResponseEntity.ok(ApiResponse.success("Profile updated",
                careerService.update(getUserId(userDetails), fields)));
    }

    @PostMapping("/generate")
    public ResponseEntity<ApiResponse<CareerGuidance>> generate(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(
                "Your career guidance is ready! 🚀",
                careerService.generateGuidance(getUserId(userDetails))));
    }

    private Long getUserId(UserDetails ud) {
        return userRepository.findByEmail(ud.getUsername()).orElseThrow().getId();
    }
}
