package com.saathi.controller;
import com.saathi.dto.response.ApiResponse;
import com.saathi.entity.OfflineSyncQueue;
import com.saathi.repository.UserRepository;
import com.saathi.service.OfflineSyncService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.*;
@RestController @RequestMapping("/api/sync") @RequiredArgsConstructor
public class OfflineSyncController {
    private final OfflineSyncService syncService;
    private final UserRepository userRepository;
    @PostMapping("/queue") public ResponseEntity<ApiResponse<OfflineSyncQueue>> queue(@AuthenticationPrincipal UserDetails ud, @RequestBody Map<String,String> body) {
        return ResponseEntity.ok(ApiResponse.success("Queued", syncService.queueItem(id(ud), body.get("entityType"), body.get("payload"), body.get("operation")))); }
    @PostMapping("/process") public ResponseEntity<ApiResponse<Map<String,Object>>> process(@AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(ApiResponse.success("Sync complete", syncService.processSyncQueue(id(ud)))); }
    @GetMapping("/pending") public ResponseEntity<ApiResponse<List<OfflineSyncQueue>>> pending(@AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(ApiResponse.success(syncService.getPendingItems(id(ud)))); }
    @GetMapping("/count") public ResponseEntity<ApiResponse<Long>> count(@AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(ApiResponse.success(syncService.getPendingCount(id(ud)))); }
    private Long id(UserDetails ud) { return userRepository.findByEmail(ud.getUsername()).orElseThrow().getId(); }
}
