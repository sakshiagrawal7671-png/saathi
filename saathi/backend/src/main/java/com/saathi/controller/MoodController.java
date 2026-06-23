package com.saathi.controller;

import com.saathi.dto.request.MoodRequest;
import com.saathi.dto.response.ApiResponse;
import com.saathi.entity.MoodEntry;
import com.saathi.repository.UserRepository;
import com.saathi.service.MoodService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/mood")
@RequiredArgsConstructor
public class MoodController {

    private final MoodService moodService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<MoodEntry>> logMood(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody MoodRequest request) {
        Long userId = getUserId(userDetails);
        return ResponseEntity.ok(ApiResponse.success("Mood logged", moodService.logMood(userId, request)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<MoodEntry>>> getHistory(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(moodService.getMoodHistory(getUserId(userDetails))));
    }

    @GetMapping("/today")
    public ResponseEntity<ApiResponse<MoodEntry>> getToday(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(moodService.getTodayMood(getUserId(userDetails))));
    }

    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAnalytics(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(moodService.getMoodAnalytics(getUserId(userDetails))));
    }

    private Long getUserId(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername()).orElseThrow().getId();
    }
}
