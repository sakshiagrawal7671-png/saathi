package com.saathi.controller;
import com.saathi.dto.response.ApiResponse;
import com.saathi.entity.PositiveMemory;
import com.saathi.repository.UserRepository;
import com.saathi.service.PositiveMemoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.*;
@RestController @RequestMapping("/api/memories") @RequiredArgsConstructor
public class PositiveMemoryController {
    private final PositiveMemoryService memoryService;
    private final UserRepository userRepository;
    @PostMapping public ResponseEntity<ApiResponse<PositiveMemory>> add(@AuthenticationPrincipal UserDetails ud, @RequestBody Map<String,String> body) {
        PositiveMemory.MemoryCategory cat = null;
        try { cat = PositiveMemory.MemoryCategory.valueOf(body.getOrDefault("category","OTHER")); } catch (Exception ignored) {}
        return ResponseEntity.ok(ApiResponse.success("Memory saved 😊", memoryService.addMemory(id(ud), body.get("title"), body.get("description"), cat, body.get("emoji"), body.get("memoryDate")))); }
    @GetMapping public ResponseEntity<ApiResponse<List<PositiveMemory>>> getAll(@AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(ApiResponse.success(memoryService.getMemories(id(ud)))); }
    @PostMapping("/{memoryId}/pin") public ResponseEntity<ApiResponse<PositiveMemory>> togglePin(@AuthenticationPrincipal UserDetails ud, @PathVariable Long memoryId) {
        return ResponseEntity.ok(ApiResponse.success(memoryService.togglePin(id(ud), memoryId))); }
    @DeleteMapping("/{memoryId}") public ResponseEntity<ApiResponse<Void>> delete(@AuthenticationPrincipal UserDetails ud, @PathVariable Long memoryId) {
        memoryService.deleteMemory(id(ud), memoryId); return ResponseEntity.ok(ApiResponse.success("Deleted", null)); }
    @GetMapping("/stats") public ResponseEntity<ApiResponse<Map<String,Object>>> stats(@AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(ApiResponse.success(memoryService.getTimelineStats(id(ud)))); }
    private Long id(UserDetails ud) { return userRepository.findByEmail(ud.getUsername()).orElseThrow().getId(); }
}
