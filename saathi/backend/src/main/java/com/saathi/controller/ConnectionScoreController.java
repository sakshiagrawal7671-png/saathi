package com.saathi.controller;

import com.saathi.dto.response.ApiResponse;
import com.saathi.entity.ConnectionLog;
import com.saathi.repository.UserRepository;
import com.saathi.service.ConnectionScoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/connection")
@RequiredArgsConstructor
public class ConnectionScoreController {

    private final ConnectionScoreService connectionService;
    private final UserRepository userRepository;

    @PostMapping("/log")
    public ResponseEntity<ApiResponse<ConnectionLog>> log(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> body) {
        ConnectionLog.ConnectionType type = ConnectionLog.ConnectionType.valueOf(body.get("type"));
        return ResponseEntity.ok(ApiResponse.success("Connection logged 💜",
                connectionService.logConnection(getUserId(userDetails), type, body.get("description"))));
    }

    @GetMapping("/score")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getScore(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(connectionService.getScore(getUserId(userDetails))));
    }

    @GetMapping("/logs")
    public ResponseEntity<ApiResponse<List<ConnectionLog>>> getLogs(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(connectionService.getRecentLogs(getUserId(userDetails))));
    }

    private Long getUserId(UserDetails ud) {
        return userRepository.findByEmail(ud.getUsername()).orElseThrow().getId();
    }
}
