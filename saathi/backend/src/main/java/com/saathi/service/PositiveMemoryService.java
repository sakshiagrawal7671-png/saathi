package com.saathi.service;
import com.saathi.entity.PositiveMemory;
import java.util.List;
import java.util.Map;
public interface PositiveMemoryService {
    PositiveMemory addMemory(Long userId, String title, String description,
                             PositiveMemory.MemoryCategory category, String emoji, String memoryDate);
    List<PositiveMemory> getMemories(Long userId);
    PositiveMemory togglePin(Long userId, Long memoryId);
    void deleteMemory(Long userId, Long memoryId);
    Map<String, Object> getTimelineStats(Long userId);
}
