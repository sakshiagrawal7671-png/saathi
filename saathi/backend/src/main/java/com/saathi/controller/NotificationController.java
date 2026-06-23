package com.saathi.controller;

import com.saathi.dto.response.ApiResponse;
import com.saathi.entity.NotificationLog;
import com.saathi.entity.NotificationPreference;
import com.saathi.repository.UserRepository;
import com.saathi.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    @PostMapping("/register-token")
    public ResponseEntity<ApiResponse<Void>> registerToken(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> body) {
        notificationService.registerToken(getUserId(userDetails), body.get("token"), body.get("deviceType"));
        return ResponseEntity.ok(ApiResponse.success("Push notifications enabled 🔔", null));
    }

    @PostMapping("/unregister-token")
    public ResponseEntity<ApiResponse<Void>> unregisterToken(@RequestBody Map<String, String> body) {
        notificationService.unregisterToken(body.get("token"));
        return ResponseEntity.ok(ApiResponse.success("Token removed", null));
    }

    @GetMapping("/preferences")
    public ResponseEntity<ApiResponse<NotificationPreference>> getPreferences(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(notificationService.getPreferences(getUserId(userDetails))));
    }

    @PutMapping("/preferences")
    public ResponseEntity<ApiResponse<NotificationPreference>> updatePreferences(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, Object> fields) {
        return ResponseEntity.ok(ApiResponse.success("Preferences updated",
                notificationService.updatePreferences(getUserId(userDetails), fields)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationLog>>> getNotifications(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(notificationService.getNotifications(getUserId(userDetails))));
    }

    @PostMapping("/mark-all-read")
    public ResponseEntity<ApiResponse<Void>> markAllRead(@AuthenticationPrincipal UserDetails userDetails) {
        notificationService.markAllRead(getUserId(userDetails));
        return ResponseEntity.ok(ApiResponse.success("All marked as read", null));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Long>> unreadCount(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(notificationService.getUnreadCount(getUserId(userDetails))));
    }

    @PostMapping("/test")
    public ResponseEntity<ApiResponse<NotificationLog>> sendTest(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(notificationService.sendNotification(
                getUserId(userDetails), "Test Notification 🔔",
                "This is what your SAATHI notifications will look like!",
                NotificationLog.NotificationType.SYSTEM)));
    }

    private Long getUserId(UserDetails ud) {
        return userRepository.findByEmail(ud.getUsername()).orElseThrow().getId();
    }
}
