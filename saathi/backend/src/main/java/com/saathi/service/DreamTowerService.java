package com.saathi.service;

import com.saathi.entity.DreamEntry;
import java.util.List;
import java.util.Map;

public interface DreamTowerService {
    DreamEntry addDream(Long userId, String title, String description, DreamEntry.DreamCategory category);
    List<DreamEntry> getDreams(Long userId);
    DreamEntry updateProgress(Long userId, Long dreamId, int progress);
    void deleteDream(Long userId, Long dreamId);
    Map<String, Object> getTowerStats(Long userId);
}
