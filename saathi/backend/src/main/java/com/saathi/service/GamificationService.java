package com.saathi.service;

import com.saathi.entity.Achievement;
import com.saathi.entity.DailyQuest;
import java.util.List;
import java.util.Map;

public interface GamificationService {
    void awardXP(Long userId, int xp, String reason);
    List<DailyQuest> getDailyQuests(Long userId);
    DailyQuest completeQuest(Long userId, Long questId);
    void generateDailyQuests(Long userId);
    List<Achievement> getAchievements(Long userId);
    void checkAndUnlockAchievements(Long userId);
    Map<String, Object> getRPGProfile(Long userId);
}
