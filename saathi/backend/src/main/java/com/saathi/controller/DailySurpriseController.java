package com.saathi.controller;

import com.saathi.dto.response.ApiResponse;
import com.saathi.entity.DailySurprise;
import com.saathi.repository.UserRepository;
import com.saathi.service.DailySurpriseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/surprises")
@RequiredArgsConstructor
public class DailySurpriseController {

    private final DailySurpriseService surpriseService;
    private final UserRepository userRepository;

    @GetMapping("/today")
    public ResponseEntity<ApiResponse<List<DailySurprise>>> getToday(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(surpriseService.getTodaysSurprises(getUserId(userDetails))));
    }

    @PostMapping("/{id}/open")
    public ResponseEntity<ApiResponse<DailySurprise>> open(
            @AuthenticationPrincipal UserDetails userDetails, @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(surpriseService.openSurprise(getUserId(userDetails), id)));
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<ApiResponse<DailySurprise>> complete(
            @AuthenticationPrincipal UserDetails userDetails, @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Completed! +15 XP 🌟",
                surpriseService.completeSurprise(getUserId(userDetails), id)));
    }

    private Long getUserId(UserDetails ud) {
        return userRepository.findByEmail(ud.getUsername()).orElseThrow().getId();
    }
}
