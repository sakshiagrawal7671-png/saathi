package com.saathi.service;

import com.saathi.dto.request.MoodRequest;
import com.saathi.entity.MoodEntry;
import java.util.List;
import java.util.Map;

public interface MoodService {
    MoodEntry logMood(Long userId, MoodRequest request);
    List<MoodEntry> getMoodHistory(Long userId);
    Map<String, Object> getMoodAnalytics(Long userId);
    MoodEntry getTodayMood(Long userId);
}
