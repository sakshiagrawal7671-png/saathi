package com.saathi.service.impl;

import com.saathi.entity.ConnectionLog;
import com.saathi.entity.User;
import com.saathi.exception.SaathiException;
import com.saathi.repository.ConnectionLogRepository;
import com.saathi.repository.FamilyMemberRepository;
import com.saathi.repository.UserRepository;
import com.saathi.service.ConnectionScoreService;
import com.saathi.service.GamificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ConnectionScoreServiceImpl implements ConnectionScoreService {

    private final ConnectionLogRepository connectionRepo;
    private final UserRepository userRepository;
    private final FamilyMemberRepository familyRepo;
    private final GamificationService gamificationService;

    private static final Map<ConnectionLog.ConnectionType, Integer> TYPE_WEIGHTS = Map.of(
        ConnectionLog.ConnectionType.FAMILY_CONTACT, 15,
        ConnectionLog.ConnectionType.MEANINGFUL_CONVERSATION, 12,
        ConnectionLog.ConnectionType.KINDNESS_ACT, 10,
        ConnectionLog.ConnectionType.COMMUNITY_SUPPORT, 10,
        ConnectionLog.ConnectionType.FRIEND_CONNECTION, 12,
        ConnectionLog.ConnectionType.GRATITUDE_SHARED, 8,
        ConnectionLog.ConnectionType.COMPANION_CHAT, 5
    );

    @Override
    public ConnectionLog logConnection(Long userId, ConnectionLog.ConnectionType type, String description) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new SaathiException("User not found", HttpStatus.NOT_FOUND));

        ConnectionLog log = connectionRepo.save(ConnectionLog.builder()
                .user(user).type(type).description(description).logDate(LocalDate.now()).build());

        int xp = TYPE_WEIGHTS.getOrDefault(type, 5);
        gamificationService.awardXP(userId, xp, "Connection: " + type.name());

        return log;
    }

    @Override
    public Map<String, Object> getScore(Long userId) {
        LocalDate weekAgo  = LocalDate.now().minusDays(7);
        LocalDate monthAgo = LocalDate.now().minusDays(30);

        List<ConnectionLog> weekLogs  = connectionRepo.findByUserIdAndLogDateBetween(userId, weekAgo, LocalDate.now());
        List<ConnectionLog> monthLogs = connectionRepo.findByUserIdAndLogDateBetween(userId, monthAgo, LocalDate.now());

        // Weighted score calculation
        int weekScore = weekLogs.stream()
                .mapToInt(l -> TYPE_WEIGHTS.getOrDefault(l.getType(), 5)).sum();
        int monthScore = monthLogs.stream()
                .mapToInt(l -> TYPE_WEIGHTS.getOrDefault(l.getType(), 5)).sum();

        // Normalize to 0-100 (max possible ~100/week with daily activity)
        int weeklyPercent = Math.min(100, weekScore);

        String level;
        String message;
        if (weeklyPercent >= 80) { level = "Deeply Connected"; message = "Your relationships are thriving! Keep nurturing them. 🌟"; }
        else if (weeklyPercent >= 50) { level = "Well Connected"; message = "You're maintaining good connections. A little more goes a long way."; }
        else if (weeklyPercent >= 25) { level = "Building Connections"; message = "You're making an effort — every connection matters."; }
        else { level = "Room to Grow"; message = "Consider reaching out to someone today. Connection heals."; }

        // Breakdown by type
        Map<String, Long> breakdown = new LinkedHashMap<>();
        for (ConnectionLog.ConnectionType t : ConnectionLog.ConnectionType.values()) {
            long count = weekLogs.stream().filter(l -> l.getType() == t).count();
            breakdown.put(t.name(), count);
        }

        // Family connection check
        long familyMembers = familyRepo.findByUserIdOrderByNameAsc(userId).size();
        long familyContactsWeek = weekLogs.stream()
                .filter(l -> l.getType() == ConnectionLog.ConnectionType.FAMILY_CONTACT).count();

        Map<String, Object> result = new HashMap<>();
        result.put("weeklyScore", weeklyPercent);
        result.put("weeklyRawScore", weekScore);
        result.put("monthlyRawScore", monthScore);
        result.put("level", level);
        result.put("message", message);
        result.put("weekConnections", weekLogs.size());
        result.put("monthConnections", monthLogs.size());
        result.put("breakdown", breakdown);
        result.put("familyMembersCount", familyMembers);
        result.put("familyContactsThisWeek", familyContactsWeek);
        return result;
    }

    @Override
    public List<ConnectionLog> getRecentLogs(Long userId) {
        return connectionRepo.findByUserIdOrderByCreatedAtDesc(userId);
    }
}
