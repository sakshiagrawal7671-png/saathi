package com.saathi.controller;

import com.saathi.dto.request.GoalRequest;
import com.saathi.dto.response.ApiResponse;
import com.saathi.entity.Goal;
import com.saathi.repository.UserRepository;
import com.saathi.service.GoalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
@RequiredArgsConstructor
public class GoalController {

    private final GoalService goalService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<Goal>> create(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody GoalRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Goal created", goalService.createGoal(getUserId(userDetails), request)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Goal>>> getAll(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(goalService.getGoals(getUserId(userDetails))));
    }

    @PatchMapping("/{id}/progress")
    public ResponseEntity<ApiResponse<Goal>> updateProgress(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @RequestParam int progress) {
        return ResponseEntity.ok(ApiResponse.success("Progress updated", goalService.updateProgress(getUserId(userDetails), id, progress)));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Goal>> updateStatus(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @RequestParam Goal.GoalStatus status) {
        return ResponseEntity.ok(ApiResponse.success("Status updated", goalService.updateStatus(getUserId(userDetails), id, status)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        goalService.deleteGoal(getUserId(userDetails), id);
        return ResponseEntity.ok(ApiResponse.success("Goal deleted", null));
    }

    private Long getUserId(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername()).orElseThrow().getId();
    }
}
