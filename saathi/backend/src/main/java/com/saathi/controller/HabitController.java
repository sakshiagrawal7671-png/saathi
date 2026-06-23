package com.saathi.controller;

import com.saathi.dto.request.HabitRequest;
import com.saathi.dto.response.ApiResponse;
import com.saathi.entity.Habit;
import com.saathi.entity.HabitLog;
import com.saathi.repository.UserRepository;
import com.saathi.service.HabitService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/habits")
@RequiredArgsConstructor
public class HabitController {

    private final HabitService habitService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<Habit>> create(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody HabitRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Habit created", habitService.createHabit(getUserId(userDetails), request)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Habit>>> getAll(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(habitService.getHabits(getUserId(userDetails))));
    }

    @PostMapping("/{id}/log")
    public ResponseEntity<ApiResponse<HabitLog>> log(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Habit logged", habitService.logHabit(getUserId(userDetails), id)));
    }

    @GetMapping("/today")
    public ResponseEntity<ApiResponse<Map<String, Object>>> todayProgress(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(habitService.getTodayProgress(getUserId(userDetails))));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        habitService.deleteHabit(getUserId(userDetails), id);
        return ResponseEntity.ok(ApiResponse.success("Habit removed", null));
    }

    private Long getUserId(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername()).orElseThrow().getId();
    }
}
