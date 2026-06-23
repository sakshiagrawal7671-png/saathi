package com.saathi.controller;
import com.saathi.dto.response.ApiResponse;
import com.saathi.entity.ColoringSession;
import com.saathi.repository.UserRepository;
import com.saathi.service.ColoringService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
@RestController @RequestMapping("/api/coloring") @RequiredArgsConstructor
public class ColoringController {
    private final ColoringService coloringService;
    private final UserRepository userRepository;
    @PostMapping("/session") public ResponseEntity<ApiResponse<ColoringSession>> save(@AuthenticationPrincipal UserDetails ud, @RequestBody Map<String,Object> body) {
        return ResponseEntity.ok(ApiResponse.success("Session saved 🎨",
            coloringService.saveSession(id(ud), (String)body.get("templateName"), (int)body.getOrDefault("durationMinutes",5)))); }
    @GetMapping("/stats") public ResponseEntity<ApiResponse<Map<String,Object>>> stats(@AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(ApiResponse.success(coloringService.getStats(id(ud)))); }
    private Long id(UserDetails ud) { return userRepository.findByEmail(ud.getUsername()).orElseThrow().getId(); }
}
