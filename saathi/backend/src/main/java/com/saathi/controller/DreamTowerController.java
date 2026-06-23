package com.saathi.controller;

import com.saathi.dto.response.ApiResponse;
import com.saathi.entity.DreamEntry;
import com.saathi.repository.UserRepository;
import com.saathi.service.DreamTowerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dreams")
@RequiredArgsConstructor
public class DreamTowerController {

    private final DreamTowerService dreamService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<DreamEntry>> add(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> body) {
        DreamEntry.DreamCategory cat = DreamEntry.DreamCategory.valueOf(
                body.getOrDefault("category", "OTHER"));
        return ResponseEntity.ok(ApiResponse.success("Dream added to your tower! 🏰",
                dreamService.addDream(getUserId(userDetails),
                        body.get("title"), body.get("description"), cat)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<DreamEntry>>> getAll(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(dreamService.getDreams(getUserId(userDetails))));
    }

    @PatchMapping("/{id}/progress")
    public ResponseEntity<ApiResponse<DreamEntry>> updateProgress(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @RequestParam int progress) {
        return ResponseEntity.ok(ApiResponse.success("Progress updated!",
                dreamService.updateProgress(getUserId(userDetails), id, progress)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        dreamService.deleteDream(getUserId(userDetails), id);
        return ResponseEntity.ok(ApiResponse.success("Dream removed", null));
    }

    @GetMapping("/tower")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getTower(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(dreamService.getTowerStats(getUserId(userDetails))));
    }

    private Long getUserId(UserDetails ud) {
        return userRepository.findByEmail(ud.getUsername()).orElseThrow().getId();
    }
}
