package com.saathi.service.impl;

import com.saathi.entity.*;
import com.saathi.exception.SaathiException;
import com.saathi.repository.*;
import com.saathi.service.GamificationService;
import com.saathi.service.PositiveMemoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class PositiveMemoryServiceImpl implements PositiveMemoryService {

    private final PositiveMemoryRepository memoryRepo;
    private final UserRepository userRepository;
    private final GamificationService gamificationService;

    @Override
    public PositiveMemory addMemory(Long userId, String title, String description,
                                    PositiveMemory.MemoryCategory category, String emoji, String memoryDate) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new SaathiException("User not found", HttpStatus.NOT_FOUND));

        LocalDate date = null;
        try { if (memoryDate != null && !memoryDate.isBlank()) date = LocalDate.parse(memoryDate); }
        catch (Exception ignored) {}

        PositiveMemory memory = memoryRepo.save(PositiveMemory.builder()
                .user(user)
                .title(title)
                .description(description)
                .category(category != null ? category : PositiveMemory.MemoryCategory.OTHER)
                .emoji(emoji != null ? emoji : "😊")
                .memoryDate(date != null ? date : LocalDate.now())
                .build());

        gamificationService.awardXP(userId, 8, "Added a positive memory");
        return memory;
    }

    @Override
    public List<PositiveMemory> getMemories(Long userId) {
        return memoryRepo.findByUserIdOrderByMemoryDateDescCreatedAtDesc(userId);
    }

    @Override
    public PositiveMemory togglePin(Long userId, Long memoryId) {
        PositiveMemory memory = memoryRepo.findById(memoryId)
                .orElseThrow(() -> new SaathiException("Memory not found", HttpStatus.NOT_FOUND));
        if (!memory.getUser().getId().equals(userId))
            throw new SaathiException("Not authorized", HttpStatus.FORBIDDEN);
        memory.setPinned(!memory.isPinned());
        return memoryRepo.save(memory);
    }

    @Override
    public void deleteMemory(Long userId, Long memoryId) {
        PositiveMemory memory = memoryRepo.findById(memoryId)
                .orElseThrow(() -> new SaathiException("Memory not found", HttpStatus.NOT_FOUND));
        if (!memory.getUser().getId().equals(userId))
            throw new SaathiException("Not authorized", HttpStatus.FORBIDDEN);
        memoryRepo.delete(memory);
    }

    @Override
    public Map<String, Object> getTimelineStats(Long userId) {
        long total = memoryRepo.countByUserId(userId);
        long pinned = memoryRepo.findByUserIdAndPinnedTrueOrderByCreatedAtDesc(userId).size();

        Map<String, Long> byCategory = new LinkedHashMap<>();
        for (PositiveMemory.MemoryCategory cat : PositiveMemory.MemoryCategory.values()) {
            long count = memoryRepo.findByUserIdAndCategoryOrderByCreatedAtDesc(userId, cat).size();
            if (count > 0) byCategory.put(cat.name(), count);
        }

        String vaultLevel;
        if (total < 5)       vaultLevel = "BEGINNING";
        else if (total < 15) vaultLevel = "GROWING";
        else if (total < 30) vaultLevel = "RICH";
        else                 vaultLevel = "ABUNDANT";

        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalMemories", total);
        stats.put("pinnedCount", pinned);
        stats.put("byCategory", byCategory);
        stats.put("vaultLevel", vaultLevel);
        return stats;
    }
}
