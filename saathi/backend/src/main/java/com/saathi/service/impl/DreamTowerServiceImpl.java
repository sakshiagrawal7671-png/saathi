package com.saathi.service.impl;

import com.saathi.entity.DreamEntry;
import com.saathi.entity.User;
import com.saathi.exception.SaathiException;
import com.saathi.repository.DreamEntryRepository;
import com.saathi.repository.UserRepository;
import com.saathi.service.DreamTowerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DreamTowerServiceImpl implements DreamTowerService {

    private final DreamEntryRepository dreamRepository;
    private final UserRepository userRepository;

    @Override
    public DreamEntry addDream(Long userId, String title, String description, DreamEntry.DreamCategory category) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new SaathiException("User not found", HttpStatus.NOT_FOUND));
        return dreamRepository.save(DreamEntry.builder()
                .user(user).title(title).description(description).category(category).build());
    }

    @Override
    public List<DreamEntry> getDreams(Long userId) {
        return dreamRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Override
    public DreamEntry updateProgress(Long userId, Long dreamId, int progress) {
        DreamEntry dream = dreamRepository.findById(dreamId)
                .orElseThrow(() -> new SaathiException("Dream not found", HttpStatus.NOT_FOUND));
        if (!dream.getUser().getId().equals(userId))
            throw new SaathiException("Not authorized", HttpStatus.FORBIDDEN);
        dream.setProgressPercent(Math.min(100, Math.max(0, progress)));
        return dreamRepository.save(dream);
    }

    @Override
    public void deleteDream(Long userId, Long dreamId) {
        DreamEntry dream = dreamRepository.findById(dreamId)
                .orElseThrow(() -> new SaathiException("Dream not found", HttpStatus.NOT_FOUND));
        if (!dream.getUser().getId().equals(userId))
            throw new SaathiException("Not authorized", HttpStatus.FORBIDDEN);
        dreamRepository.delete(dream);
    }

    @Override
    public Map<String, Object> getTowerStats(Long userId) {
        List<DreamEntry> dreams = dreamRepository.findByUserIdOrderByCreatedAtDesc(userId);
        int total = dreams.size();
        int completed = (int) dreams.stream().filter(d -> d.getProgressPercent() == 100).count();
        double avgProgress = dreams.stream().mapToInt(DreamEntry::getProgressPercent).average().orElse(0);

        String towerStage;
        if (total == 0) towerStage = "FOUNDATION";
        else if (total < 3) towerStage = "GROUND_FLOOR";
        else if (total < 6) towerStage = "RISING";
        else if (total < 10) towerStage = "TALL";
        else towerStage = "SKY_HIGH";

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalDreams", total);
        stats.put("completedDreams", completed);
        stats.put("avgProgress", Math.round(avgProgress));
        stats.put("towerStage", towerStage);
        stats.put("towerFloors", total);
        return stats;
    }
}
