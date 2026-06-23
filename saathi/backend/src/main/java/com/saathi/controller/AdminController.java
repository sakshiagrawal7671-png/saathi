package com.saathi.controller;

import com.saathi.dto.response.ApiResponse;
import com.saathi.dto.response.UserResponse;
import com.saathi.entity.CommunityPost;
import com.saathi.entity.User;
import com.saathi.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStats() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getDashboardStats()));
    }

    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAnalytics() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getAnalytics()));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        List<UserResponse> users = adminService.getAllUsers(page, size).stream()
                .map(UserResponse::from).toList();
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @PatchMapping("/users/{id}/role")
    public ResponseEntity<ApiResponse<UserResponse>> updateRole(
            @PathVariable Long id, @RequestParam User.Role role) {
        return ResponseEntity.ok(ApiResponse.success("Role updated",
                UserResponse.from(adminService.updateUserRole(id, role))));
    }

    @PatchMapping("/users/{id}/toggle-enabled")
    public ResponseEntity<ApiResponse<UserResponse>> toggleEnabled(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("User status updated",
                UserResponse.from(adminService.toggleUserEnabled(id))));
    }

    @GetMapping("/posts/flagged")
    public ResponseEntity<ApiResponse<List<CommunityPost>>> getFlagged() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getFlaggedPosts()));
    }

    @PatchMapping("/posts/{id}/flag")
    public ResponseEntity<ApiResponse<CommunityPost>> flagPost(
            @PathVariable Long id, @RequestParam boolean flagged) {
        return ResponseEntity.ok(ApiResponse.success(adminService.flagPost(id, flagged)));
    }

    @DeleteMapping("/posts/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePost(@PathVariable Long id) {
        adminService.deletePost(id);
        return ResponseEntity.ok(ApiResponse.success("Post removed", null));
    }
}
