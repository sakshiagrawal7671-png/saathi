package com.saathi.service.impl;

import com.saathi.dto.request.GratitudeRequest;
import com.saathi.entity.GratitudeEntry;
import com.saathi.entity.User;
import com.saathi.exception.SaathiException;
import com.saathi.repository.GratitudeEntryRepository;
import com.saathi.repository.UserRepository;
import com.saathi.service.GratitudeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class GratitudeServiceImpl implements GratitudeService {

    private final GratitudeEntryRepository gratitudeRepository;
    private final UserRepository userRepository;

    @Override
    public GratitudeEntry addGratitude(Long userId, GratitudeRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new SaathiException("User not found", HttpStatus.NOT_FOUND));

        GratitudeEntry entry = GratitudeEntry.builder()
                .user(user)
                .content(request.getContent())
                .category(request.getCategory())
                .build();

        return gratitudeRepository.save(entry);
    }

    @Override
    public List<GratitudeEntry> getGratitudes(Long userId) {
        return gratitudeRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Override
    public Map<String, Object> getGardenStats(Long userId) {
        long count = gratitudeRepository.countByUserId(userId);
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalEntries", count);

        String stage;
        if (count < 5) stage = "SEED";
        else if (count < 15) stage = "SPROUT";
        else if (count < 30) stage = "PLANT";
        else if (count < 60) stage = "TREE";
        else if (count < 100) stage = "FOREST";
        else stage = "PARADISE";

        stats.put("gardenStage", stage);
        stats.put("nextMilestone", getNextMilestone(count));
        return stats;
    }

    private long getNextMilestone(long count) {
        if (count < 5) return 5;
        if (count < 15) return 15;
        if (count < 30) return 30;
        if (count < 60) return 60;
        if (count < 100) return 100;
        return count + 50;
    }
}
