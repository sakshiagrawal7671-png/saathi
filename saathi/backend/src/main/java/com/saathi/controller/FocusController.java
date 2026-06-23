package com.saathi.controller;

import com.saathi.dto.request.FocusSessionRequest;
import com.saathi.dto.response.ApiResponse;
import com.saathi.entity.FocusSession;
import com.saathi.repository.UserRepository;
import com.saathi.service.FocusService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/focus")
@RequiredArgsConstructor
public class FocusController {

    private final FocusService focusService;
    private final UserRepository userRepository;

    @PostMapping("/start")
    public ResponseEntity<ApiResponse<FocusSession>> start(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody FocusSessionRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Session started", focusService.startSession(getUserId(userDetails), request)));
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<ApiResponse<FocusSession>> complete(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Session completed", focusService.completeSession(getUserId(userDetails), id)));
    }

    @GetMapping("/sessions")
    public ResponseEntity<ApiResponse<List<FocusSession>>> getSessions(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(focusService.getSessions(getUserId(userDetails))));
    }

    @GetMapping("/forest")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getForest(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(focusService.getForestStats(getUserId(userDetails))));
    }

    private Long getUserId(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername()).orElseThrow().getId();
    }
}
