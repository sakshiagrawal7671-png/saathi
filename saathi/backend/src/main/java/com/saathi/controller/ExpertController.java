package com.saathi.controller;

import com.saathi.dto.response.ApiResponse;
import com.saathi.entity.ExpertContent;
import com.saathi.entity.ExpertProfile;
import com.saathi.repository.UserRepository;
import com.saathi.service.ExpertService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/experts")
@RequiredArgsConstructor
public class ExpertController {

    private final ExpertService expertService;
    private final UserRepository userRepository;

    @PostMapping("/apply")
    public ResponseEntity<ApiResponse<ExpertProfile>> apply(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(ApiResponse.success("Application submitted! We'll review it soon 💜",
                expertService.applyAsExpert(getUserId(userDetails),
                        ExpertProfile.ExpertType.valueOf(body.get("expertType")),
                        body.get("credentials"), body.get("bio"), body.get("specialization"))));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<ExpertProfile>> myApplication(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(expertService.getMyApplication(getUserId(userDetails))));
    }

    @GetMapping("/me/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> myStats(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(expertService.getExpertStats(getUserId(userDetails))));
    }

    @PostMapping("/content")
    public ResponseEntity<ApiResponse<ExpertContent>> createContent(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(ApiResponse.success("Content published! 🎉",
                expertService.createContent(getUserId(userDetails),
                        body.get("title"), body.get("content"), body.get("theme"), body.get("icon"))));
    }

    @GetMapping("/content")
    public ResponseEntity<ApiResponse<List<ExpertContent>>> allContent() {
        return ResponseEntity.ok(ApiResponse.success(expertService.getAllContent()));
    }

    @GetMapping("/content/mine")
    public ResponseEntity<ApiResponse<List<ExpertContent>>> myContent(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(expertService.getMyContent(getUserId(userDetails))));
    }

    @PostMapping("/content/{id}/helpful")
    public ResponseEntity<ApiResponse<ExpertContent>> markHelpful(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(expertService.markHelpful(id)));
    }

    // Admin endpoints
    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<ExpertProfile>>> pending() {
        return ResponseEntity.ok(ApiResponse.success(expertService.getPendingApplications()));
    }

    @PostMapping("/{id}/review")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ExpertProfile>> review(
            @PathVariable Long id, @RequestParam boolean approve) {
        return ResponseEntity.ok(ApiResponse.success(expertService.reviewApplication(id, approve)));
    }

    private Long getUserId(UserDetails ud) {
        return userRepository.findByEmail(ud.getUsername()).orElseThrow().getId();
    }
}
