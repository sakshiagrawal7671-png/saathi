package com.saathi.service.impl;

import com.saathi.dto.response.DashboardResponse;
import com.saathi.dto.response.UserResponse;
import com.saathi.entity.MoodEntry;
import com.saathi.entity.User;
import com.saathi.exception.SaathiException;
import com.saathi.repository.*;
import com.saathi.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;
    private final MoodEntryRepository moodRepository;
    private final JournalEntryRepository journalRepository;
    private final GratitudeEntryRepository gratitudeRepository;
    private final HabitRepository habitRepository;
    private final FocusSessionRepository focusRepository;

    private static final String[] WISDOMS = {
        "Every small step forward is still progress.",
        "You are worthy of love and belonging, just as you are.",
        "Growth begins at the edge of your comfort zone.",
        "The people who love you make your life meaningful.",
        "Today's struggles are tomorrow's strengths.",
        "Be gentle with yourself — you're doing your best.",
        "Connection is the antidote to loneliness.",
        "Your story is still being written.",
        "Small consistent actions create lasting change.",
        "You matter more than you know."
    };

    private static final String[] CHALLENGES = {
        "Call or message someone you haven't spoken to in a while 💬",
        "Write 3 things you're grateful for today 🙏",
        "Take a 10-minute walk outside 🌿",
        "Tell someone you appreciate them ❤️",
        "Write about one thing you're proud of this week ✨",
        "Drink 8 glasses of water today 💧",
        "Do something kind for someone without expecting anything back 🤝",
        "Spend 25 minutes focused on one important task 🎯"
    };

    @Override
    public DashboardResponse getDashboard(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new SaathiException("User not found", HttpStatus.NOT_FOUND));

        MoodEntry todayMood = moodRepository.findByUserIdAndEntryDateBetweenOrderByEntryDateAsc(
                userId, LocalDate.now(), LocalDate.now()).stream().findFirst().orElse(null);

        List<MoodEntry> recentMoodEntries = moodRepository.findByUserIdAndEntryDateBetweenOrderByEntryDateAsc(
                userId, LocalDate.now().minusDays(7), LocalDate.now());

        List<Map<String, Object>> recentMoods = new ArrayList<>();
        recentMoodEntries.forEach(m -> {
            Map<String, Object> map = new HashMap<>();
            map.put("date", m.getEntryDate().toString());
            map.put("mood", m.getMood().name());
            map.put("energy", m.getEnergyLevel());
            recentMoods.add(map);
        });

        int focusToday = focusRepository.sumCompletedMinutesSince(userId,
                LocalDate.now().atStartOfDay());

        int dayOfYear = LocalDate.now().getDayOfYear();
        String wisdom = WISDOMS[dayOfYear % WISDOMS.length];
        String challenge = CHALLENGES[dayOfYear % CHALLENGES.length];

        return DashboardResponse.builder()
                .user(UserResponse.from(user))
                .todayMood(todayMood != null ? todayMood.getMood().name() : null)
                .streakDays(user.getStreakDays())
                .xpPoints(user.getXpPoints())
                .level(user.getLevel())
                .journalCount(journalRepository.findByUserIdOrderByCreatedAtDesc(userId).size())
                .gratitudeCount(gratitudeRepository.countByUserId(userId))
                .habitCount(habitRepository.findByUserIdAndActiveTrue(userId).size())
                .focusMinutesToday(focusToday)
                .recentMoods(recentMoods)
                .dailyWisdom(wisdom)
                .dailyChallenge(challenge)
                .build();
    }
}
