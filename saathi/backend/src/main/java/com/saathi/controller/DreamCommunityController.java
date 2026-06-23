package com.saathi.controller;
import com.saathi.dto.response.ApiResponse;
import com.saathi.entity.DreamCommunity;
import com.saathi.repository.UserRepository;
import com.saathi.service.DreamCommunityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.*;
@RestController @RequestMapping("/api/communities") @RequiredArgsConstructor
public class DreamCommunityController {
    private final DreamCommunityService communityService;
    private final UserRepository userRepository;
    @GetMapping public ResponseEntity<ApiResponse<List<DreamCommunity>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(communityService.getAllCommunities())); }
    @GetMapping("/{id}") public ResponseEntity<ApiResponse<Map<String,Object>>> get(@PathVariable Long id, @AuthenticationPrincipal UserDetails ud) {
        Map<String,Object> stats = communityService.getCommunityStats(id);
        stats.put("isMember", communityService.isMember(id(ud), id));
        return ResponseEntity.ok(ApiResponse.success(stats)); }
    @PostMapping("/{id}/join") public ResponseEntity<ApiResponse<Void>> join(@AuthenticationPrincipal UserDetails ud, @PathVariable Long id) {
        communityService.joinCommunity(id(ud), id); return ResponseEntity.ok(ApiResponse.success("Joined! Welcome 🎉", null)); }
    @PostMapping("/{id}/leave") public ResponseEntity<ApiResponse<Void>> leave(@AuthenticationPrincipal UserDetails ud, @PathVariable Long id) {
        communityService.leaveCommunity(id(ud), id); return ResponseEntity.ok(ApiResponse.success("Left community", null)); }
    @GetMapping("/mine") public ResponseEntity<ApiResponse<List<DreamCommunity>>> mine(@AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(ApiResponse.success(communityService.getMyCommunitities(id(ud)))); }
    private Long id(UserDetails ud) { return userRepository.findByEmail(ud.getUsername()).orElseThrow().getId(); }
}
