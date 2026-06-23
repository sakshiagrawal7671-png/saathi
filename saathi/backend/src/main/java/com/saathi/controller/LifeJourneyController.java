package com.saathi.controller;

import com.saathi.dto.response.ApiResponse;
import com.saathi.entity.LifeChapter;
import com.saathi.repository.UserRepository;
import com.saathi.service.LifeJourneyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/journey")
@RequiredArgsConstructor
public class LifeJourneyController {

    private final LifeJourneyService journeyService;
    private final UserRepository userRepository;

    @GetMapping("/chapters")
    public ResponseEntity<ApiResponse<List<LifeChapter>>> getChapters(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(journeyService.getChapters(getUserId(userDetails))));
    }

    @GetMapping("/current")
    public ResponseEntity<ApiResponse<LifeChapter>> getCurrent(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(journeyService.getCurrentChapter(getUserId(userDetails))));
    }

    @PutMapping("/chapters/{number}")
    public ResponseEntity<ApiResponse<LifeChapter>> update(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable int number,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(ApiResponse.success("Chapter updated",
                journeyService.updateChapterStory(getUserId(userDetails),
                        number, body.get("story"), body.get("milestone"))));
    }

    @PostMapping("/chapters/{number}/complete")
    public ResponseEntity<ApiResponse<LifeChapter>> complete(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable int number) {
        return ResponseEntity.ok(ApiResponse.success("Chapter completed! Next chapter unlocked 📖",
                journeyService.completeChapter(getUserId(userDetails), number)));
    }

    private Long getUserId(UserDetails ud) {
        return userRepository.findByEmail(ud.getUsername()).orElseThrow().getId();
    }
}
