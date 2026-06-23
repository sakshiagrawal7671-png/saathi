package com.saathi.service;
import com.saathi.entity.LifeMapEntry;
import java.util.List;
import java.util.Map;
public interface LifeMapService {
    LifeMapEntry addEntry(Long userId, LifeMapEntry.MapSection section, String title,
                          String description, String targetDate);
    List<LifeMapEntry> getMap(Long userId);
    LifeMapEntry toggleComplete(Long userId, Long entryId);
    void deleteEntry(Long userId, Long entryId);
    Map<String, Object> getMapSummary(Long userId);
}
