package com.saathi.controller;
import com.saathi.dto.response.ApiResponse;
import com.saathi.entity.LifeMapEntry;
import com.saathi.repository.UserRepository;
import com.saathi.service.LifeMapService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.*;
@RestController @RequestMapping("/api/life-map") @RequiredArgsConstructor
public class LifeMapController {
    private final LifeMapService lifeMapService;
    private final UserRepository userRepository;
    @PostMapping public ResponseEntity<ApiResponse<LifeMapEntry>> add(@AuthenticationPrincipal UserDetails ud, @RequestBody Map<String,String> body) {
        LifeMapEntry.MapSection section = LifeMapEntry.MapSection.valueOf(body.getOrDefault("section","SHORT_TERM_GOAL"));
        return ResponseEntity.ok(ApiResponse.success("Added to your Life Map 🗺️",
            lifeMapService.addEntry(id(ud), section, body.get("title"), body.get("description"), body.get("targetDate")))); }
    @GetMapping public ResponseEntity<ApiResponse<Map<String,Object>>> getMap(@AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(ApiResponse.success(lifeMapService.getMapSummary(id(ud)))); }
    @PostMapping("/{entryId}/complete") public ResponseEntity<ApiResponse<LifeMapEntry>> complete(@AuthenticationPrincipal UserDetails ud, @PathVariable Long entryId) {
        return ResponseEntity.ok(ApiResponse.success(lifeMapService.toggleComplete(id(ud), entryId))); }
    @DeleteMapping("/{entryId}") public ResponseEntity<ApiResponse<Void>> delete(@AuthenticationPrincipal UserDetails ud, @PathVariable Long entryId) {
        lifeMapService.deleteEntry(id(ud), entryId); return ResponseEntity.ok(ApiResponse.success("Removed", null)); }
    private Long id(UserDetails ud) { return userRepository.findByEmail(ud.getUsername()).orElseThrow().getId(); }
}
