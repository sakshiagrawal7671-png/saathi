package com.saathi.controller;

import com.saathi.dto.request.JournalRequest;
import com.saathi.dto.response.ApiResponse;
import com.saathi.entity.JournalEntry;
import com.saathi.repository.UserRepository;
import com.saathi.service.JournalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/journal")
@RequiredArgsConstructor
public class JournalController {

    private final JournalService journalService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<JournalEntry>> create(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody JournalRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Journal entry created", journalService.createEntry(getUserId(userDetails), request)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<JournalEntry>>> getAll(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(journalService.getEntries(getUserId(userDetails))));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<JournalEntry>> getOne(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(journalService.getEntry(getUserId(userDetails), id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<JournalEntry>> update(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody JournalRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Entry updated", journalService.updateEntry(getUserId(userDetails), id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        journalService.deleteEntry(getUserId(userDetails), id);
        return ResponseEntity.ok(ApiResponse.success("Entry deleted", null));
    }

    private Long getUserId(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername()).orElseThrow().getId();
    }
}
