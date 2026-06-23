package com.saathi.controller;

import com.saathi.dto.request.FamilyMemberRequest;
import com.saathi.dto.response.ApiResponse;
import com.saathi.entity.FamilyMember;
import com.saathi.repository.UserRepository;
import com.saathi.service.FamilyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/family")
@RequiredArgsConstructor
public class FamilyController {

    private final FamilyService familyService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<FamilyMember>> add(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody FamilyMemberRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Member added", familyService.addMember(getUserId(userDetails), request)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<FamilyMember>>> getAll(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(familyService.getMembers(getUserId(userDetails))));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<FamilyMember>> update(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody FamilyMemberRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Member updated", familyService.updateMember(getUserId(userDetails), id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        familyService.deleteMember(getUserId(userDetails), id);
        return ResponseEntity.ok(ApiResponse.success("Member removed", null));
    }

    @PostMapping("/{id}/contact")
    public ResponseEntity<ApiResponse<Void>> recordContact(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        familyService.recordContact(getUserId(userDetails), id);
        return ResponseEntity.ok(ApiResponse.success("Contact recorded", null));
    }

    private Long getUserId(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername()).orElseThrow().getId();
    }
}
