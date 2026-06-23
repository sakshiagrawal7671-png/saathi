package com.saathi.controller;

import com.saathi.dto.response.ApiResponse;
import com.saathi.entity.SaathiShort;
import com.saathi.entity.ShortView;
import com.saathi.repository.UserRepository;
import com.saathi.service.ShortsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/shorts")
@RequiredArgsConstructor
public class ShortsController {

    private final ShortsService shortsService;
    private final UserRepository userRepository;

    @GetMapping("/daily")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getDaily(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(shortsService.getDailyShorts(getUserId(userDetails))));
    }

    @PostMapping("/{id}/view")
    public ResponseEntity<ApiResponse<ShortView>> markViewed(
            @AuthenticationPrincipal UserDetails userDetails, @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(shortsService.markViewed(getUserId(userDetails), id)));
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<ApiResponse<ShortView>> toggleLike(
            @AuthenticationPrincipal UserDetails userDetails, @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(shortsService.toggleLike(getUserId(userDetails), id)));
    }

    @PostMapping("/{id}/save")
    public ResponseEntity<ApiResponse<ShortView>> toggleSave(
            @AuthenticationPrincipal UserDetails userDetails, @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(shortsService.toggleSave(getUserId(userDetails), id)));
    }

    @GetMapping("/saved")
    public ResponseEntity<ApiResponse<List<SaathiShort>>> getSaved(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(shortsService.getSaved(getUserId(userDetails))));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStats(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(shortsService.getStats(getUserId(userDetails))));
    }

    private Long getUserId(UserDetails ud) {
        return userRepository.findByEmail(ud.getUsername()).orElseThrow().getId();
    }
}
