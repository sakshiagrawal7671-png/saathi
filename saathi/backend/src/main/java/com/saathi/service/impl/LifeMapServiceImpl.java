package com.saathi.service.impl;

import com.saathi.entity.*;
import com.saathi.exception.SaathiException;
import com.saathi.repository.*;
import com.saathi.service.LifeMapService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class LifeMapServiceImpl implements LifeMapService {

    private final LifeMapEntryRepository mapRepo;
    private final UserRepository userRepository;

    @Override
    public LifeMapEntry addEntry(Long userId, LifeMapEntry.MapSection section, String title,
                                  String description, String targetDate) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new SaathiException("User not found", HttpStatus.NOT_FOUND));

        LocalDate date = null;
        try { if (targetDate != null && !targetDate.isBlank()) date = LocalDate.parse(targetDate); }
        catch (Exception ignored) {}

        long count = mapRepo.findByUserIdAndSectionOrderByOrderIndexAsc(userId, section).size();

        return mapRepo.save(LifeMapEntry.builder()
                .user(user)
                .section(section)
                .title(title)
                .description(description)
                .targetDate(date)
                .orderIndex((int) count)
                .build());
    }

    @Override
    public List<LifeMapEntry> getMap(Long userId) {
        return mapRepo.findByUserIdOrderBySectionAscOrderIndexAsc(userId);
    }

    @Override
    public LifeMapEntry toggleComplete(Long userId, Long entryId) {
        LifeMapEntry entry = mapRepo.findById(entryId)
                .orElseThrow(() -> new SaathiException("Entry not found", HttpStatus.NOT_FOUND));
        if (!entry.getUser().getId().equals(userId))
            throw new SaathiException("Not authorized", HttpStatus.FORBIDDEN);
        entry.setCompleted(!entry.isCompleted());
        return mapRepo.save(entry);
    }

    @Override
    public void deleteEntry(Long userId, Long entryId) {
        LifeMapEntry entry = mapRepo.findById(entryId)
                .orElseThrow(() -> new SaathiException("Entry not found", HttpStatus.NOT_FOUND));
        if (!entry.getUser().getId().equals(userId))
            throw new SaathiException("Not authorized", HttpStatus.FORBIDDEN);
        mapRepo.delete(entry);
    }

    @Override
    public Map<String, Object> getMapSummary(Long userId) {
        List<LifeMapEntry> all = getMap(userId);
        long completed = all.stream().filter(LifeMapEntry::isCompleted).count();

        Map<String, List<LifeMapEntry>> bySection = new LinkedHashMap<>();
        for (LifeMapEntry.MapSection s : LifeMapEntry.MapSection.values())
            bySection.put(s.name(), new ArrayList<>());
        all.forEach(e -> bySection.get(e.getSection().name()).add(e));

        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("total", all.size());
        summary.put("completed", completed);
        summary.put("bySection", bySection);
        summary.put("progressPercent", all.isEmpty() ? 0 : (int)((completed * 100.0) / all.size()));
        return summary;
    }
}
