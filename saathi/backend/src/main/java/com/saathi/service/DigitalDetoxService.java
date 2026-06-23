package com.saathi.service;
import com.saathi.entity.DigitalDetoxGoal;
import com.saathi.entity.UsageSession;
import java.util.Map;
public interface DigitalDetoxService {
    UsageSession startSession(Long userId);
    UsageSession endSession(Long userId);
    Map<String, Object> getDailyUsage(Long userId);
    Map<String, Object> getWeeklyReport(Long userId);
    DigitalDetoxGoal getGoal(Long userId);
    DigitalDetoxGoal updateGoal(Long userId, int dailyLimitMinutes, boolean breakReminders, int breakInterval, boolean weekendDetox, String activities);
}
