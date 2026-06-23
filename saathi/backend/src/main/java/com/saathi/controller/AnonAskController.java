package com.saathi.controller;
import com.saathi.dto.response.ApiResponse;
import com.saathi.entity.*;
import com.saathi.repository.UserRepository;
import com.saathi.service.AnonAskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.*;
@RestController @RequestMapping("/api/ask") @RequiredArgsConstructor
public class AnonAskController {
    private final AnonAskService askService;
    private final UserRepository userRepository;
    @PostMapping public ResponseEntity<ApiResponse<AnonQuestion>> post(@AuthenticationPrincipal UserDetails ud, @RequestBody Map<String,String> body) {
        AnonQuestion.QuestionCategory cat = null;
        try { cat = AnonQuestion.QuestionCategory.valueOf(body.getOrDefault("category","GENERAL")); } catch (Exception ignored) {}
        return ResponseEntity.ok(ApiResponse.success("Question posted anonymously 💜", askService.postQuestion(id(ud), body.get("question"), cat))); }
    @GetMapping public ResponseEntity<ApiResponse<List<AnonQuestion>>> getAll(@RequestParam(defaultValue="0") int page, @RequestParam(defaultValue="20") int size) {
        return ResponseEntity.ok(ApiResponse.success(askService.getQuestions(page, size))); }
    @GetMapping("/category/{category}") public ResponseEntity<ApiResponse<List<AnonQuestion>>> byCategory(@PathVariable AnonQuestion.QuestionCategory category, @RequestParam(defaultValue="0") int page) {
        return ResponseEntity.ok(ApiResponse.success(askService.getByCategory(category, page))); }
    @PostMapping("/{id}/support") public ResponseEntity<ApiResponse<Void>> support(@PathVariable Long id) {
        askService.supportQuestion(id); return ResponseEntity.ok(ApiResponse.success("Support sent 💜", null)); }
    @PostMapping("/{id}/answers") public ResponseEntity<ApiResponse<AnonAnswer>> answer(@AuthenticationPrincipal UserDetails ud, @PathVariable Long id, @RequestBody Map<String,String> body) {
        return ResponseEntity.ok(ApiResponse.success("Answer posted", askService.postAnswer(id(ud), id, body.get("content")))); }
    @GetMapping("/{id}/answers") public ResponseEntity<ApiResponse<List<AnonAnswer>>> answers(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(askService.getAnswers(id))); }
    @PostMapping("/answers/{id}/helpful") public ResponseEntity<ApiResponse<Void>> helpful(@PathVariable Long id) {
        askService.markAnswerHelpful(id); return ResponseEntity.ok(ApiResponse.success("Marked helpful", null)); }
    private Long id(UserDetails ud) { return userRepository.findByEmail(ud.getUsername()).orElseThrow().getId(); }
}
