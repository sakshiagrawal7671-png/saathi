package com.saathi.service.impl;

import com.saathi.entity.*;
import com.saathi.exception.SaathiException;
import com.saathi.repository.*;
import com.saathi.service.DigitalDetoxService;
import com.saathi.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.*;
import java.util.*;

@Service @RequiredArgsConstructor
public class DigitalDetoxServiceImpl implements DigitalDetoxService {

    private final UsageSessionRepository usageRepo;
    private final DigitalDetoxGoalRepository goalRepo;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    private static final List<String> ACTIVITIES = List.of(
        "Take a 10-minute walk 🌿", "Call someone you love ❤️", "Make tea and sit quietly 🍵",
        "Write in your journal ✍️", "Do breathing exercises 🌬️", "Read a few pages 📖",
        "Stretch or do light yoga 🧘", "Notice 3 beautiful things outside 🌅",
        "Water a plant 🌱", "Do one small kind act 🤝"
    );

    @Override
    public UsageSession startSession(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new SaathiException("User not found", HttpStatus.NOT_FOUND));
        usageRepo.findTopByUserIdAndSessionEndIsNullOrderBySessionStartDesc(userId).ifPresent(open -> {
            open.setSessionEnd(LocalDateTime.now());
            open.setDurationMinutes((int) Duration.between(open.getSessionStart(), open.getSessionEnd()).toMinutes());
            usageRepo.save(open);
        });
        return usageRepo.save(UsageSession.builder().user(user).sessionDate(LocalDate.now()).build());
    }

    @Override
    public UsageSession endSession(Long userId) {
        return usageRepo.findTopByUserIdAndSessionEndIsNullOrderBySessionStartDesc(userId).map(session -> {
            session.setSessionEnd(LocalDateTime.now());
            int duration = (int) Duration.between(session.getSessionStart(), session.getSessionEnd()).toMinutes();
            session.setDurationMinutes(Math.max(1, duration));
            UsageSession saved = usageRepo.save(session);
            DigitalDetoxGoal goal = getGoal(userId);
            int today = usageRepo.sumMinutesForDate(userId, LocalDate.now());
            if (goal != null && today >= goal.getDailyLimitMinutes())
                notificationService.sendNotification(userId, "Time for a real-world break! 🌿",
                        "You've reached your daily SAATHI limit.", NotificationLog.NotificationType.SYSTEM);
            return saved;
        }).orElse(null);
    }

    @Override
    public Map<String, Object> getDailyUsage(Long userId) {
        int todayMins = usageRepo.sumMinutesForDate(userId, LocalDate.now());
        DigitalDetoxGoal goal = getGoal(userId);
        int limit = goal != null ? goal.getDailyLimitMinutes() : 60;
        int pct = limit > 0 ? Math.min(100, (todayMins * 100) / limit) : 0;
        String status = pct < 50 ? "HEALTHY" : pct < 80 ? "MODERATE" : pct < 100 ? "HIGH" : "OVER";
        String message = switch(status) {
            case "HEALTHY" -> "You're using SAATHI mindfully today. 🌱";
            case "MODERATE" -> "About halfway through your daily limit.";
            case "HIGH" -> "Almost at your limit — consider a real-world break soon.";
            default -> "You've reached your daily limit. Step away and recharge! 💚";
        };
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("todayMinutes", todayMins);
        result.put("limitMinutes", limit);
        result.put("percentUsed", pct);
        result.put("remainingMinutes", Math.max(0, limit - todayMins));
        result.put("status", status);
        result.put("message", message);
        result.put("suggestedActivity", ACTIVITIES.get(LocalDate.now().getDayOfYear() % ACTIVITIES.size()));
        result.put("breakRemindersEnabled", goal != null && goal.isBreakRemindersEnabled());
        result.put("breakIntervalMinutes", goal != null ? goal.getBreakIntervalMinutes() : 25);
        return result;
    }

    @Override
    public Map<String, Object> getWeeklyReport(Long userId) {
        LocalDate today = LocalDate.now();
        DigitalDetoxGoal goal = getGoal(userId);
        int limit = goal != null ? goal.getDailyLimitMinutes() : 60;
        List<Map<String, Object>> daily = new ArrayList<>();
        int total = 0, daysOver = 0;
        for (int i = 6; i >= 0; i--) {
            LocalDate day = today.minusDays(i);
            int mins = usageRepo.sumMinutesForDate(userId, day);
            total += mins;
            if (mins > limit) daysOver++;
            daily.add(Map.of("date", day.toString(), "dayName", day.getDayOfWeek().name().substring(0,3),
                    "minutes", mins, "overLimit", mins > limit));
        }
        Map<String, Object> report = new LinkedHashMap<>();
        report.put("weeklyData", daily);
        report.put("totalMinutes", total);
        report.put("avgDailyMinutes", Math.round(total / 7.0));
        report.put("daysOverLimit", daysOver);
        report.put("limitMinutes", limit);
        report.put("insight", daysOver == 0 ? "Excellent! You stayed within your limit all week. 🌟"
                : daysOver <= 2 ? "Good balance! A couple of days over limit — that's human. 🌱"
                : "Consider scheduling phone-free hours. 💜");
        return report;
    }

    @Override
    public DigitalDetoxGoal getGoal(Long userId) {
        return goalRepo.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId).orElse(null);
            if (user == null) return null;
            return goalRepo.save(DigitalDetoxGoal.builder().user(user).detoxActivities(String.join("|", ACTIVITIES.subList(0,5))).build());
        });
    }

    @Override
    public DigitalDetoxGoal updateGoal(Long userId, int daily, boolean reminders, int interval, boolean weekend, String activities) {
        DigitalDetoxGoal goal = getGoal(userId);
        if (goal == null) throw new SaathiException("User not found", HttpStatus.NOT_FOUND);
        goal.setDailyLimitMinutes(daily);
        goal.setBreakRemindersEnabled(reminders);
        goal.setBreakIntervalMinutes(interval);
        goal.setWeekendDetoxEnabled(weekend);
        if (activities != null) goal.setDetoxActivities(activities);
        return goalRepo.save(goal);
    }
}
