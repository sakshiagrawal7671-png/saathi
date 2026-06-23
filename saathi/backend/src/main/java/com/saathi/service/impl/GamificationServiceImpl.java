package com.saathi.service.impl;

import com.saathi.entity.*;
import com.saathi.exception.SaathiException;
import com.saathi.repository.*;
import com.saathi.service.GamificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class GamificationServiceImpl implements GamificationService {

    private final UserRepository userRepository;
    private final DailyQuestRepository questRepository;
    private final AchievementRepository achievementRepository;
    private final JournalEntryRepository journalRepository;
    private final HabitRepository habitRepository;
    private final GratitudeEntryRepository gratitudeRepository;
    private final FocusSessionRepository focusRepository;

    private static final Map<Integer, String> LEVEL_TITLES = new LinkedHashMap<>() {{
        put(1,  "Seeker");      put(2,  "Explorer");    put(3,  "Wanderer");
        put(5,  "Dreamer");     put(8,  "Builder");     put(10, "Guardian");
        put(15, "Champion");    put(20, "Sage");         put(30, "Luminary");
        put(50, "Legend");
    }};

    @Override
    public void awardXP(Long userId, int xp, String reason) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new SaathiException("User not found", HttpStatus.NOT_FOUND));

        int oldLevel = user.getLevel();
        user.setXpPoints(user.getXpPoints() + xp);

        // Level up formula: each level needs level*100 XP
        int newLevel = calculateLevel(user.getXpPoints());
        user.setLevel(newLevel);
        user.setLastActiveAt(LocalDateTime.now());
        userRepository.save(user);

        if (newLevel > oldLevel) {
            log.info("User {} leveled up to {}!", userId, newLevel);
            checkAndUnlockAchievements(userId);
        }
    }

    private int calculateLevel(int totalXp) {
        int level = 1;
        int xpNeeded = 100;
        int accumulated = 0;
        while (accumulated + xpNeeded <= totalXp) {
            accumulated += xpNeeded;
            level++;
            xpNeeded = level * 100;
        }
        return level;
    }

    @Override
    public List<DailyQuest> getDailyQuests(Long userId) {
        List<DailyQuest> quests = questRepository.findByUserIdAndQuestDate(userId, LocalDate.now());
        if (quests.isEmpty()) {
            generateDailyQuests(userId);
            quests = questRepository.findByUserIdAndQuestDate(userId, LocalDate.now());
        }
        return quests;
    }

    @Override
    public void generateDailyQuests(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new SaathiException("User not found", HttpStatus.NOT_FOUND));

        if (!questRepository.findByUserIdAndQuestDate(userId, LocalDate.now()).isEmpty()) return;

        List<DailyQuest> quests = new ArrayList<>();
        quests.add(buildQuest(user, "Log your mood today", "How are you feeling? Take a moment to check in.", DailyQuest.QuestType.MOOD_LOG, 20));
        quests.add(buildQuest(user, "Write in your journal", "Reflect on your thoughts and feelings.", DailyQuest.QuestType.JOURNAL, 30));
        quests.add(buildQuest(user, "Complete a habit", "Build momentum with one of your daily habits.", DailyQuest.QuestType.HABIT, 25));
        quests.add(buildQuest(user, "Add a gratitude entry", "Find something beautiful in today.", DailyQuest.QuestType.GRATITUDE, 20));
        quests.add(buildQuest(user, "Talk to SAATHI", "Share how your day is going.", DailyQuest.QuestType.COMPANION_CHAT, 15));
        quests.add(buildQuest(user, "Connect with family", "Reach out to someone who loves you.", DailyQuest.QuestType.FAMILY_CONTACT, 40));

        questRepository.saveAll(quests);
    }

    private DailyQuest buildQuest(User user, String title, String desc, DailyQuest.QuestType type, int xp) {
        return DailyQuest.builder()
                .user(user).title(title).description(desc)
                .type(type).xpReward(xp).questDate(LocalDate.now()).build();
    }

    @Override
    public DailyQuest completeQuest(Long userId, Long questId) {
        DailyQuest quest = questRepository.findById(questId)
                .orElseThrow(() -> new SaathiException("Quest not found", HttpStatus.NOT_FOUND));

        if (!quest.getUser().getId().equals(userId))
            throw new SaathiException("Not authorized", HttpStatus.FORBIDDEN);

        if (quest.isCompleted()) return quest;

        quest.setCompleted(true);
        quest.setStatus(DailyQuest.QuestStatus.COMPLETED);
        quest.setCompletedAt(LocalDateTime.now());
        questRepository.save(quest);

        awardXP(userId, quest.getXpReward(), "Quest: " + quest.getTitle());
        checkAndUnlockAchievements(userId);

        return quest;
    }

    @Override
    public List<Achievement> getAchievements(Long userId) {
        return achievementRepository.findByUserIdOrderByUnlockedAtDesc(userId);
    }

    @Override
    public void checkAndUnlockAchievements(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return;

        // Level achievements
        unlockIfNeeded(userId, Achievement.AchievementType.LEVEL_5,
                user.getLevel() >= 5, "Level 5 Reached!", "You're building momentum!", "⭐", "#f59e0b");
        unlockIfNeeded(userId, Achievement.AchievementType.LEVEL_10,
                user.getLevel() >= 10, "Level 10 Champion!", "Double digits — you're unstoppable!", "🏆", "#f97316");
        unlockIfNeeded(userId, Achievement.AchievementType.LEVEL_20,
                user.getLevel() >= 20, "Level 20 Sage", "Your growth is remarkable.", "👑", "#7c3aed");

        // Streak achievements
        unlockIfNeeded(userId, Achievement.AchievementType.STREAK_7,
                user.getStreakDays() >= 7, "7-Day Streak!", "A week of consistent growth!", "🔥", "#ef4444");
        unlockIfNeeded(userId, Achievement.AchievementType.STREAK_30,
                user.getStreakDays() >= 30, "30-Day Legend", "30 days — extraordinary!", "🌟", "#7c3aed");

        // Content achievements
        long journals = journalRepository.findByUserIdOrderByCreatedAtDesc(userId).size();
        unlockIfNeeded(userId, Achievement.AchievementType.FIRST_JOURNAL,
                journals >= 1, "First Journal Entry", "The journey of a thousand miles begins here.", "📓", "#10b981");

        long gratitudes = gratitudeRepository.countByUserId(userId);
        unlockIfNeeded(userId, Achievement.AchievementType.GRATITUDE_GURU,
                gratitudes >= 30, "Gratitude Guru", "30 seeds of gratitude planted!", "🌸", "#ec4899");

        int focusMins = focusRepository.sumCompletedMinutesSince(userId, LocalDateTime.now().minusDays(365));
        unlockIfNeeded(userId, Achievement.AchievementType.FOCUS_CHAMPION,
                focusMins >= 500, "Focus Champion", "500 minutes of deep focus!", "🌲", "#84cc16");
    }

    private void unlockIfNeeded(Long userId, Achievement.AchievementType type, boolean condition,
                                 String title, String desc, String icon, String color) {
        if (condition && !achievementRepository.existsByUserIdAndType(userId, type)) {
            User user = userRepository.findById(userId).orElse(null);
            if (user == null) return;
            achievementRepository.save(Achievement.builder()
                    .user(user).type(type).title(title).description(desc)
                    .icon(icon).badgeColor(color).build());
        }
    }

    @Override
    public Map<String, Object> getRPGProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new SaathiException("User not found", HttpStatus.NOT_FOUND));

        int currentLevelXp = xpForLevel(user.getLevel());
        int nextLevelXp = xpForLevel(user.getLevel() + 1);
        int progressXp = user.getXpPoints() - currentLevelXp;
        int neededXp = nextLevelXp - currentLevelXp;
        int progressPct = neededXp > 0 ? (int) ((progressXp * 100.0) / neededXp) : 100;

        String title = LEVEL_TITLES.entrySet().stream()
                .filter(e -> user.getLevel() >= e.getKey())
                .map(Map.Entry::getValue)
                .reduce((a, b) -> b).orElse("Seeker");

        List<DailyQuest> todayQuests = getDailyQuests(userId);
        long completedQuests = todayQuests.stream().filter(DailyQuest::isCompleted).count();

        Map<String, Object> profile = new HashMap<>();
        profile.put("level", user.getLevel());
        profile.put("title", title);
        profile.put("xpPoints", user.getXpPoints());
        profile.put("streakDays", user.getStreakDays());
        profile.put("currentLevelXp", progressXp);
        profile.put("nextLevelXp", neededXp);
        profile.put("progressPercent", progressPct);
        profile.put("todayQuests", todayQuests);
        profile.put("completedQuestsToday", completedQuests);
        profile.put("achievements", achievementRepository.findByUserIdOrderByUnlockedAtDesc(userId));
        return profile;
    }

    private int xpForLevel(int level) {
        int total = 0;
        for (int i = 1; i < level; i++) total += i * 100;
        return total;
    }
}
