package com.saathi.controller;

import com.saathi.dto.response.ApiResponse;
import com.saathi.entity.PurposeProfile;
import com.saathi.entity.ValueCard;
import com.saathi.repository.UserRepository;
import com.saathi.service.PurposeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/purpose")
@RequiredArgsConstructor
public class PurposeController {

    private final PurposeService purposeService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(
                purposeService.getFullProfile(getUserId(userDetails))));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<PurposeProfile>> update(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> fields) {
        return ResponseEntity.ok(ApiResponse.success("Profile updated ✨",
                purposeService.update(getUserId(userDetails), fields)));
    }

    @PostMapping("/generate")
    public ResponseEntity<ApiResponse<PurposeProfile>> generate(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Your purpose statement has been crafted 💜",
                purposeService.generatePurposeStatement(getUserId(userDetails))));
    }

    @GetMapping("/values")
    public ResponseEntity<ApiResponse<List<ValueCard>>> getValues(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(
                purposeService.getValues(getUserId(userDetails))));
    }

    @PostMapping("/values")
    public ResponseEntity<ApiResponse<Void>> saveValues(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody List<Map<String, Object>> values) {
        purposeService.saveValues(getUserId(userDetails), values);
        return ResponseEntity.ok(ApiResponse.success("Values saved", null));
    }

    private Long getUserId(UserDetails ud) {
        return userRepository.findByEmail(ud.getUsername()).orElseThrow().getId();
    }
}
