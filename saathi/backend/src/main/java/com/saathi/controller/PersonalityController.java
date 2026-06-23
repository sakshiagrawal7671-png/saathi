package com.saathi.controller;

import com.saathi.dto.response.ApiResponse;
import com.saathi.entity.PersonalityAssessment;
import com.saathi.entity.PersonalityQuestion;
import com.saathi.repository.UserRepository;
import com.saathi.service.PersonalityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/personality")
@RequiredArgsConstructor
public class PersonalityController {

    private final PersonalityService personalityService;
    private final UserRepository userRepository;

    @GetMapping("/questions")
    public ResponseEntity<ApiResponse<List<PersonalityQuestion>>> getQuestions() {
        return ResponseEntity.ok(ApiResponse.success(personalityService.getQuestions()));
    }

    @PostMapping("/submit")
    public ResponseEntity<ApiResponse<PersonalityAssessment>> submit(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<Long, Integer> answers) {
        return ResponseEntity.ok(ApiResponse.success(
                "Assessment complete! Here is your personality profile 🌟",
                personalityService.submitAssessment(getUserId(userDetails), answers)));
    }

    @GetMapping("/result")
    public ResponseEntity<ApiResponse<PersonalityAssessment>> getResult(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(
                personalityService.getResult(getUserId(userDetails))));
    }

    @GetMapping("/status")
    public ResponseEntity<ApiResponse<Boolean>> hasCompleted(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(
                personalityService.hasCompleted(getUserId(userDetails))));
    }

    private Long getUserId(UserDetails ud) {
        return userRepository.findByEmail(ud.getUsername()).orElseThrow().getId();
    }
}
