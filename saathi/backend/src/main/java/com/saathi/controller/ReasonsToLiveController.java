package com.saathi.controller;
import com.saathi.dto.response.ApiResponse;
import com.saathi.entity.*;
import com.saathi.repository.UserRepository;
import com.saathi.service.ReasonsToLiveService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.*;
@RestController @RequestMapping("/api/vault") @RequiredArgsConstructor
public class ReasonsToLiveController {
    private final ReasonsToLiveService vaultService;
    private final UserRepository userRepository;
    @PostMapping("/reasons") public ResponseEntity<ApiResponse<ReasonsToLive>> add(@AuthenticationPrincipal UserDetails ud, @RequestBody Map<String,String> body) {
        return ResponseEntity.ok(ApiResponse.success("Added to your vault 💜",
            vaultService.addReason(id(ud), ReasonsToLive.ReasonCategory.valueOf(body.getOrDefault("category","OTHER")), body.get("content"), body.get("emoji")))); }
    @GetMapping("/reasons") public ResponseEntity<ApiResponse<List<ReasonsToLive>>> getAll(@AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(ApiResponse.success(vaultService.getReasons(id(ud)))); }
    @DeleteMapping("/reasons/{reasonId}") public ResponseEntity<ApiResponse<Void>> delete(@AuthenticationPrincipal UserDetails ud, @PathVariable Long reasonId) {
        vaultService.deleteReason(id(ud), reasonId); return ResponseEntity.ok(ApiResponse.success("Removed", null)); }
    @GetMapping("/why-i-matter") public ResponseEntity<ApiResponse<WhyIMatter>> getWhy(@AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(ApiResponse.success(vaultService.getWhyIMatter(id(ud)))); }
    @PutMapping("/why-i-matter") public ResponseEntity<ApiResponse<WhyIMatter>> updateWhy(@AuthenticationPrincipal UserDetails ud, @RequestBody Map<String,String> fields) {
        return ResponseEntity.ok(ApiResponse.success("Updated 💜", vaultService.updateWhyIMatter(id(ud), fields))); }
    @GetMapping("/status") public ResponseEntity<ApiResponse<Map<String,Object>>> status(@AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(ApiResponse.success(vaultService.getVaultStatus(id(ud)))); }
    private Long id(UserDetails ud) { return userRepository.findByEmail(ud.getUsername()).orElseThrow().getId(); }
}
