package com.saathi.controller;
import com.saathi.dto.response.ApiResponse;
import com.saathi.entity.InnerCircleMember;
import com.saathi.repository.UserRepository;
import com.saathi.service.InnerCircleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.*;
@RestController @RequestMapping("/api/inner-circle") @RequiredArgsConstructor
public class InnerCircleController {
    private final InnerCircleService circleService;
    private final UserRepository userRepository;
    @PostMapping public ResponseEntity<ApiResponse<InnerCircleMember>> add(@AuthenticationPrincipal UserDetails ud, @RequestBody Map<String,String> body) {
        return ResponseEntity.ok(ApiResponse.success("Added to your inner circle 💜",
            circleService.addMember(id(ud), body.get("name"), body.get("relationship"), body.get("avatarEmoji"),
                body.get("phone"), body.get("sharedMemories"), body.get("importantDate"), body.get("importantDateLabel")))); }
    @GetMapping public ResponseEntity<ApiResponse<List<InnerCircleMember>>> get(@AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(ApiResponse.success(circleService.getCircle(id(ud)))); }
    @PutMapping("/{memberId}") public ResponseEntity<ApiResponse<InnerCircleMember>> update(@AuthenticationPrincipal UserDetails ud, @PathVariable Long memberId, @RequestBody Map<String,String> fields) {
        return ResponseEntity.ok(ApiResponse.success("Updated", circleService.updateMember(id(ud), memberId, fields))); }
    @DeleteMapping("/{memberId}") public ResponseEntity<ApiResponse<Void>> remove(@AuthenticationPrincipal UserDetails ud, @PathVariable Long memberId) {
        circleService.removeMember(id(ud), memberId); return ResponseEntity.ok(ApiResponse.success("Removed", null)); }
    @PostMapping("/{memberId}/interact") public ResponseEntity<ApiResponse<Void>> interact(@AuthenticationPrincipal UserDetails ud, @PathVariable Long memberId) {
        circleService.recordInteraction(id(ud), memberId); return ResponseEntity.ok(ApiResponse.success("Interaction recorded", null)); }
    private Long id(UserDetails ud) { return userRepository.findByEmail(ud.getUsername()).orElseThrow().getId(); }
}
