package com.saathi.controller;
import com.saathi.dto.response.ApiResponse;
import com.saathi.entity.ChatMessage;
import com.saathi.repository.UserRepository;
import com.saathi.service.GeminiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
@RestController @RequestMapping("/api/ai") @RequiredArgsConstructor
public class AdvancedAiController {
    private final GeminiService geminiService;
    private final UserRepository userRepository;
    @PostMapping("/chat") public ResponseEntity<ApiResponse<ChatMessage>> chat(@AuthenticationPrincipal UserDetails ud, @RequestBody Map<String,String> body) {
        return ResponseEntity.ok(ApiResponse.success(geminiService.chat(id(ud), body.get("message"), body.get("provider")))); }
    @GetMapping("/provider") public ResponseEntity<ApiResponse<String>> provider() { return ResponseEntity.ok(ApiResponse.success(geminiService.getActiveProvider())); }
    @PostMapping("/analyze") public ResponseEntity<ApiResponse<String>> analyze(@AuthenticationPrincipal UserDetails ud, @RequestBody Map<String,String> body) {
        return ResponseEntity.ok(ApiResponse.success(geminiService.analyzeWithContext(id(ud), body.get("text"), body.getOrDefault("type","EMOTION")))); }
    @GetMapping("/insights") public ResponseEntity<ApiResponse<Map<String,Object>>> insights(@AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(ApiResponse.success(geminiService.generatePersonalizedInsights(id(ud)))); }
    private Long id(UserDetails ud) { return userRepository.findByEmail(ud.getUsername()).orElseThrow().getId(); }
}
