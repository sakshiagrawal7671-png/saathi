package com.saathi.controller;

import com.saathi.dto.response.ApiResponse;
import com.saathi.entity.Achievement;
import com.saathi.entity.DailyQuest;
import com.saathi.repository.UserRepository;
import com.saathi.service.GamificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rpg")
@RequiredArgsConstructor
public class GamificationController {

    private final GamificationService gamificationService;
    private final UserRepository userRepository;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(gamificationService.getRPGProfile(getUserId(userDetails))));
    }

    @GetMapping("/quests")
    public ResponseEntity<ApiResponse<List<DailyQuest>>> getQuests(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(gamificationService.getDailyQuests(getUserId(userDetails))));
    }

    @PostMapping("/quests/{questId}/complete")
    public ResponseEntity<ApiResponse<DailyQuest>> completeQuest(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long questId) {
        return ResponseEntity.ok(ApiResponse.success("Quest completed! XP awarded 🌟",
                gamificationService.completeQuest(getUserId(userDetails), questId)));
    }

    @GetMapping("/achievements")
    public ResponseEntity<ApiResponse<List<Achievement>>> getAchievements(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(gamificationService.getAchievements(getUserId(userDetails))));
    }

    @PostMapping("/award-xp")
    public ResponseEntity<ApiResponse<Void>> awardXP(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam int xp,
            @RequestParam String reason) {
        gamificationService.awardXP(getUserId(userDetails), xp, reason);
        return ResponseEntity.ok(ApiResponse.success("XP awarded", null));
    }

    private Long getUserId(UserDetails ud) {
        return userRepository.findByEmail(ud.getUsername()).orElseThrow().getId();
    }
}
