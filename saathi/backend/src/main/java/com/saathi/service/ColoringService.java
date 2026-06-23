package com.saathi.service;
import com.saathi.entity.ColoringSession;
import java.util.Map;
public interface ColoringService {
    ColoringSession saveSession(Long userId, String templateName, int durationMinutes);
    Map<String, Object> getStats(Long userId);
}
