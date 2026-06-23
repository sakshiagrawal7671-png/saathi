package com.saathi.service;
import com.saathi.entity.SaathiShort;
import com.saathi.entity.ShortView;
import java.util.List;
import java.util.Map;
public interface ShortsService {
    List<Map<String, Object>> getDailyShorts(Long userId);
    ShortView markViewed(Long userId, Long shortId);
    ShortView toggleLike(Long userId, Long shortId);
    ShortView toggleSave(Long userId, Long shortId);
    List<SaathiShort> getSaved(Long userId);
    Map<String, Object> getStats(Long userId);
}
