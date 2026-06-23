package com.saathi.controller;

import com.saathi.dto.response.ApiResponse;
import com.saathi.entity.PersonalIsland;
import com.saathi.repository.UserRepository;
import com.saathi.service.IslandService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/island")
@RequiredArgsConstructor
public class IslandController {

    private final IslandService islandService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStatus(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(islandService.getIslandStatus(getUserId(userDetails))));
    }

    @PatchMapping("/environment")
    public ResponseEntity<ApiResponse<PersonalIsland>> setEnvironment(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) String timeOfDay,
            @RequestParam(required = false) String weather) {
        return ResponseEntity.ok(ApiResponse.success(
                islandService.setEnvironment(getUserId(userDetails), timeOfDay, weather)));
    }

    private Long getUserId(UserDetails ud) {
        return userRepository.findByEmail(ud.getUsername()).orElseThrow().getId();
    }
}
