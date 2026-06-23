package com.saathi.controller;

import com.saathi.dto.request.ChatRequest;
import com.saathi.dto.response.ApiResponse;
import com.saathi.entity.ChatMessage;
import com.saathi.repository.UserRepository;
import com.saathi.service.AiCompanionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/companion")
@RequiredArgsConstructor
public class AiCompanionController {

    private final AiCompanionService aiService;
    private final UserRepository userRepository;

    @PostMapping("/chat")
    public ResponseEntity<ApiResponse<ChatMessage>> chat(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ChatRequest request) {
        Long userId = getUserId(userDetails);
        return ResponseEntity.ok(ApiResponse.success(aiService.chat(userId, request.getMessage())));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<ChatMessage>>> history(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(aiService.getChatHistory(getUserId(userDetails))));
    }

    @DeleteMapping("/history")
    public ResponseEntity<ApiResponse<Void>> clearHistory(@AuthenticationPrincipal UserDetails userDetails) {
        aiService.clearHistory(getUserId(userDetails));
        return ResponseEntity.ok(ApiResponse.success("History cleared", null));
    }

    private Long getUserId(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername()).orElseThrow().getId();
    }
}
