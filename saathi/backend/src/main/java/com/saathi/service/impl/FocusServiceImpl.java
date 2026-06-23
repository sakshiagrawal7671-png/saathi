package com.saathi.service.impl;

import com.saathi.dto.request.FocusSessionRequest;
import com.saathi.entity.FocusSession;
import com.saathi.entity.User;
import com.saathi.exception.SaathiException;
import com.saathi.repository.FocusSessionRepository;
import com.saathi.repository.UserRepository;
import com.saathi.service.FocusService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class FocusServiceImpl implements FocusService {

    private final FocusSessionRepository focusRepository;
    private final UserRepository userRepository;

    @Override
    public FocusSession startSession(Long userId, FocusSessionRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new SaathiException("User not found", HttpStatus.NOT_FOUND));

        FocusSession session = FocusSession.builder()
                .user(user)
                .durationMinutes(request.getDurationMinutes())
                .taskDescription(request.getTaskDescription())
                .completed(false)
                .build();

        return focusRepository.save(session);
    }

    @Override
    public FocusSession completeSession(Long userId, Long sessionId) {
        FocusSession session = focusRepository.findById(sessionId)
                .orElseThrow(() -> new SaathiException("Session not found", HttpStatus.NOT_FOUND));
        session.setCompleted(true);
        session.setEndedAt(LocalDateTime.now());
        return focusRepository.save(session);
    }

    @Override
    public List<FocusSession> getSessions(Long userId) {
        return focusRepository.findByUserIdOrderByStartedAtDesc(userId);
    }

    @Override
    public Map<String, Object> getForestStats(Long userId) {
        int totalMinutes = focusRepository.sumCompletedMinutesSince(userId,
                LocalDateTime.now().minusDays(30));
        int trees = totalMinutes / 25;
        int forests = trees / 10;

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalFocusMinutes", totalMinutes);
        stats.put("plantsGrown", trees);
        stats.put("forestsCreated", forests);

        String badge;
        if (trees < 5) badge = "SEEDLING";
        else if (trees < 20) badge = "GARDENER";
        else if (trees < 50) badge = "FORESTER";
        else badge = "NATURE_GUARDIAN";
        stats.put("badge", badge);

        return stats;
    }
}
