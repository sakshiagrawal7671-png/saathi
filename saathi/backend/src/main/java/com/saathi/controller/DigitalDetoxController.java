package com.saathi.controller;
import com.saathi.dto.response.ApiResponse;
import com.saathi.entity.*;
import com.saathi.repository.UserRepository;
import com.saathi.service.DigitalDetoxService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
@RestController @RequestMapping("/api/detox") @RequiredArgsConstructor
public class DigitalDetoxController {
    private final DigitalDetoxService detoxService;
    private final UserRepository userRepository;
    @PostMapping("/session/start") public ResponseEntity<ApiResponse<UsageSession>> start(@AuthenticationPrincipal UserDetails ud) { return ResponseEntity.ok(ApiResponse.success("Session started", detoxService.startSession(id(ud)))); }
    @PostMapping("/session/end") public ResponseEntity<ApiResponse<UsageSession>> end(@AuthenticationPrincipal UserDetails ud) { return ResponseEntity.ok(ApiResponse.success("Session ended", detoxService.endSession(id(ud)))); }
    @GetMapping("/usage/today") public ResponseEntity<ApiResponse<Map<String,Object>>> today(@AuthenticationPrincipal UserDetails ud) { return ResponseEntity.ok(ApiResponse.success(detoxService.getDailyUsage(id(ud)))); }
    @GetMapping("/usage/weekly") public ResponseEntity<ApiResponse<Map<String,Object>>> weekly(@AuthenticationPrincipal UserDetails ud) { return ResponseEntity.ok(ApiResponse.success(detoxService.getWeeklyReport(id(ud)))); }
    @GetMapping("/goal") public ResponseEntity<ApiResponse<DigitalDetoxGoal>> goal(@AuthenticationPrincipal UserDetails ud) { return ResponseEntity.ok(ApiResponse.success(detoxService.getGoal(id(ud)))); }
    @PutMapping("/goal") public ResponseEntity<ApiResponse<DigitalDetoxGoal>> updateGoal(@AuthenticationPrincipal UserDetails ud, @RequestBody Map<String,Object> body) {
        return ResponseEntity.ok(ApiResponse.success("Goal updated 🌿", detoxService.updateGoal(id(ud),
            (int)body.getOrDefault("dailyLimitMinutes",60), (boolean)body.getOrDefault("breakRemindersEnabled",true),
            (int)body.getOrDefault("breakIntervalMinutes",25), (boolean)body.getOrDefault("weekendDetoxEnabled",false), (String)body.get("detoxActivities"))));
    }
    private Long id(UserDetails ud) { return userRepository.findByEmail(ud.getUsername()).orElseThrow().getId(); }
}
