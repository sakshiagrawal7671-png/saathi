package com.saathi.service;

import com.saathi.dto.request.HabitRequest;
import com.saathi.entity.Habit;
import com.saathi.entity.HabitLog;
import java.util.List;
import java.util.Map;

public interface HabitService {
    Habit createHabit(Long userId, HabitRequest request);
    List<Habit> getHabits(Long userId);
    HabitLog logHabit(Long userId, Long habitId);
    Map<String, Object> getTodayProgress(Long userId);
    void deleteHabit(Long userId, Long habitId);
}
