package com.saathi.controller;

import com.saathi.dto.request.CommunityPostRequest;
import com.saathi.dto.response.ApiResponse;
import com.saathi.entity.CommunityPost;
import com.saathi.entity.PostComment;
import com.saathi.repository.UserRepository;
import com.saathi.service.CommunityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/community")
@RequiredArgsConstructor
public class CommunityController {

    private final CommunityService communityService;
    private final UserRepository userRepository;

    @PostMapping("/posts")
    public ResponseEntity<ApiResponse<CommunityPost>> createPost(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CommunityPostRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Post created", communityService.createPost(getUserId(userDetails), request)));
    }

    @GetMapping("/posts")
    public ResponseEntity<ApiResponse<List<CommunityPost>>> getPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success(communityService.getPosts(page, size)));
    }

    @GetMapping("/posts/category/{category}")
    public ResponseEntity<ApiResponse<List<CommunityPost>>> getByCategory(
            @PathVariable CommunityPost.PostCategory category,
            @RequestParam(defaultValue = "0") int page) {
        return ResponseEntity.ok(ApiResponse.success(communityService.getPostsByCategory(category, page)));
    }

    @PostMapping("/posts/{id}/support")
    public ResponseEntity<ApiResponse<Void>> support(@PathVariable Long id) {
        communityService.supportPost(id);
        return ResponseEntity.ok(ApiResponse.success("Support added", null));
    }

    @PostMapping("/posts/{id}/comments")
    public ResponseEntity<ApiResponse<PostComment>> addComment(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @RequestBody java.util.Map<String, Object> body) {
        String content = (String) body.get("content");
        boolean anonymous = body.containsKey("anonymous") && (boolean) body.get("anonymous");
        return ResponseEntity.ok(ApiResponse.success("Comment added",
                communityService.addComment(getUserId(userDetails), id, content, anonymous)));
    }

    @GetMapping("/posts/{id}/comments")
    public ResponseEntity<ApiResponse<List<PostComment>>> getComments(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(communityService.getComments(id)));
    }

    private Long getUserId(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername()).orElseThrow().getId();
    }
}
