package com.saathi.service;

import com.saathi.dto.request.GratitudeRequest;
import com.saathi.entity.GratitudeEntry;
import java.util.List;
import java.util.Map;

public interface GratitudeService {
    GratitudeEntry addGratitude(Long userId, GratitudeRequest request);
    List<GratitudeEntry> getGratitudes(Long userId);
    Map<String, Object> getGardenStats(Long userId);
}
