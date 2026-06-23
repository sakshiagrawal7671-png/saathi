package com.saathi.service.impl;

import com.saathi.dto.request.MoodRequest;
import com.saathi.entity.MoodEntry;
import com.saathi.entity.User;
import com.saathi.exception.SaathiException;
import com.saathi.repository.MoodEntryRepository;
import com.saathi.repository.UserRepository;
import com.saathi.service.MoodService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class MoodServiceImpl implements MoodService {

    private final MoodEntryRepository moodRepository;
    private final UserRepository userRepository;

    @Override
    public MoodEntry logMood(Long userId, MoodRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new SaathiException("User not found", HttpStatus.NOT_FOUND));

        LocalDate date = request.getEntryDate() != null ? request.getEntryDate() : LocalDate.now();

        Optional<MoodEntry> existing = moodRepository.findByUserIdAndEntryDateBetweenOrderByEntryDateAsc(
                userId, date, date).stream().findFirst();

        MoodEntry entry;
        if (existing.isPresent()) {
            entry = existing.get();
        } else {
            entry = new MoodEntry();
            entry.setUser(user);
            entry.setEntryDate(date);
        }

        entry.setMood(request.getMood());
        entry.setStressLevel(request.getStressLevel());
        entry.setAnxietyLevel(request.getAnxietyLevel());
        entry.setSleepHours(request.getSleepHours());
        entry.setEnergyLevel(request.getEnergyLevel());
        entry.setMotivationLevel(request.getMotivationLevel());
        entry.setFocusLevel(request.getFocusLevel());
        entry.setNote(request.getNote());

        return moodRepository.save(entry);
    }

    @Override
    public List<MoodEntry> getMoodHistory(Long userId) {
        return moodRepository.findByUserIdOrderByEntryDateDesc(userId);
    }

    @Override
    public Map<String, Object> getMoodAnalytics(Long userId) {
        List<MoodEntry> last30 = moodRepository.findByUserIdAndEntryDateBetweenOrderByEntryDateAsc(
                userId, LocalDate.now().minusDays(30), LocalDate.now());

        Map<String, Object> analytics = new HashMap<>();
        analytics.put("totalEntries", last30.size());

        if (!last30.isEmpty()) {
            double avgStress = last30.stream().mapToInt(MoodEntry::getStressLevel).average().orElse(0);
            double avgEnergy = last30.stream().mapToInt(MoodEntry::getEnergyLevel).average().orElse(0);
            double avgSleep = last30.stream().mapToInt(MoodEntry::getSleepHours).average().orElse(0);
            analytics.put("avgStress", Math.round(avgStress * 10.0) / 10.0);
            analytics.put("avgEnergy", Math.round(avgEnergy * 10.0) / 10.0);
            analytics.put("avgSleep", Math.round(avgSleep * 10.0) / 10.0);

            Map<String, Long> moodCounts = new HashMap<>();
            last30.forEach(e -> moodCounts.merge(e.getMood().name(), 1L, Long::sum));
            analytics.put("moodDistribution", moodCounts);

            List<Map<String, Object>> trend = new ArrayList<>();
            last30.forEach(e -> {
                Map<String, Object> point = new HashMap<>();
                point.put("date", e.getEntryDate().toString());
                point.put("mood", e.getMood().name());
                point.put("stress", e.getStressLevel());
                point.put("energy", e.getEnergyLevel());
                trend.add(point);
            });
            analytics.put("trend", trend);
        }

        return analytics;
    }

    @Override
    public MoodEntry getTodayMood(Long userId) {
        return moodRepository.findByUserIdAndEntryDateBetweenOrderByEntryDateAsc(
                userId, LocalDate.now(), LocalDate.now()).stream().findFirst().orElse(null);
    }
}
