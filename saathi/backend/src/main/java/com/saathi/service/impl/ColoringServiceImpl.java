package com.saathi.service.impl;

import com.saathi.entity.*;
import com.saathi.exception.SaathiException;
import com.saathi.repository.*;
import com.saathi.service.ColoringService;
import com.saathi.service.GamificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class ColoringServiceImpl implements ColoringService {

    private final ColoringSessionRepository coloringRepo;
    private final UserRepository userRepository;
    private final GamificationService gamificationService;

    @Override
    public ColoringSession saveSession(Long userId, String templateName, int durationMinutes) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new SaathiException("User not found", HttpStatus.NOT_FOUND));

        ColoringSession session = coloringRepo.save(ColoringSession.builder()
                .user(user)
                .templateName(templateName)
                .durationMinutes(durationMinutes)
                .build());

        gamificationService.awardXP(userId, Math.max(5, durationMinutes / 2), "Calm coloring session");
        return session;
    }

    @Override
    public Map<String, Object> getStats(Long userId) {
        long sessions = coloringRepo.countByUserId(userId);
        int totalMinutes = coloringRepo.sumMinutesByUserId(userId);

        String badge;
        if (sessions < 3)       badge = "BEGINNER";
        else if (sessions < 10) badge = "ARTIST";
        else if (sessions < 25) badge = "CREATIVE";
        else                    badge = "ZEN_MASTER";

        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("sessionsCompleted", sessions);
        stats.put("totalMinutes", totalMinutes);
        stats.put("badge", badge);
        stats.put("nextBadgeAt", sessions < 3 ? 3 : sessions < 10 ? 10 : sessions < 25 ? 25 : sessions + 25);
        return stats;
    }
}
