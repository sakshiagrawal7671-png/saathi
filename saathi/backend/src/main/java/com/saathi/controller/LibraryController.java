package com.saathi.controller;

import com.saathi.dto.response.ApiResponse;
import com.saathi.entity.ArticleInteraction;
import com.saathi.entity.LibraryArticle;
import com.saathi.repository.UserRepository;
import com.saathi.service.LibraryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/library")
@RequiredArgsConstructor
public class LibraryController {

    private final LibraryService libraryService;
    private final UserRepository userRepository;

    @GetMapping("/{type}")
    public ResponseEntity<ApiResponse<List<LibraryArticle>>> getArticles(
            @PathVariable LibraryArticle.LibraryType type,
            @RequestParam(required = false) String theme) {
        return ResponseEntity.ok(ApiResponse.success(libraryService.getArticles(type, theme)));
    }

    @GetMapping("/article/{id}")
    public ResponseEntity<ApiResponse<LibraryArticle>> getArticle(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(libraryService.getArticle(id)));
    }

    @PostMapping("/article/{id}/read")
    public ResponseEntity<ApiResponse<ArticleInteraction>> markRead(
            @AuthenticationPrincipal UserDetails userDetails, @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(libraryService.markRead(getUserId(userDetails), id)));
    }

    @PostMapping("/article/{id}/bookmark")
    public ResponseEntity<ApiResponse<ArticleInteraction>> toggleBookmark(
            @AuthenticationPrincipal UserDetails userDetails, @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(libraryService.toggleBookmark(getUserId(userDetails), id)));
    }

    @PostMapping("/article/{id}/helpful")
    public ResponseEntity<ApiResponse<ArticleInteraction>> markHelpful(
            @AuthenticationPrincipal UserDetails userDetails, @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(libraryService.markHelpful(getUserId(userDetails), id)));
    }

    @GetMapping("/bookmarked")
    public ResponseEntity<ApiResponse<List<LibraryArticle>>> getBookmarked(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) LibraryArticle.LibraryType type) {
        return ResponseEntity.ok(ApiResponse.success(libraryService.getBookmarked(getUserId(userDetails), type)));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStats(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(libraryService.getStats(getUserId(userDetails))));
    }

    private Long getUserId(UserDetails ud) {
        return userRepository.findByEmail(ud.getUsername()).orElseThrow().getId();
    }
}
