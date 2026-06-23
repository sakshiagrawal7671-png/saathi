package com.saathi.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.saathi.entity.*;
import com.saathi.exception.SaathiException;
import com.saathi.repository.*;
import com.saathi.service.OfflineSyncService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.*;
import java.util.*;

@Service @RequiredArgsConstructor @Slf4j
public class OfflineSyncServiceImpl implements OfflineSyncService {

    private final OfflineSyncQueueRepository syncRepo;
    private final UserRepository userRepository;
    private final MoodEntryRepository moodRepo;
    private final JournalEntryRepository journalRepo;
    private final GratitudeEntryRepository gratitudeRepo;
    private final FocusSessionRepository focusRepo;
    private final ObjectMapper objectMapper;

    @Override
    public OfflineSyncQueue queueItem(Long userId, String entityType, String payload, String operation) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new SaathiException("User not found", HttpStatus.NOT_FOUND));
        return syncRepo.save(OfflineSyncQueue.builder().user(user)
                .entityType(OfflineSyncQueue.SyncEntityType.valueOf(entityType))
                .payload(payload).operation(operation).build());
    }

    @Override
    public Map<String, Object> processSyncQueue(Long userId) {
        List<OfflineSyncQueue> pending = syncRepo.findByUserIdAndSyncedFalseOrderByCreatedAtAsc(userId);
        int succeeded = 0, failed = 0;
        List<String> errors = new ArrayList<>();
        for (OfflineSyncQueue item : pending) {
            try {
                if (processItem(userId, item)) { item.setSynced(true); item.setSyncedAt(LocalDateTime.now()); succeeded++; }
                else { item.setRetryCount(item.getRetryCount()+1); failed++; }
            } catch (Exception e) {
                item.setRetryCount(item.getRetryCount()+1);
                errors.add(item.getEntityType() + ": " + e.getMessage()); failed++;
            }
            syncRepo.save(item);
        }
        return Map.of("totalProcessed", pending.size(), "succeeded", succeeded, "failed", failed,
                "errors", errors, "syncedAt", LocalDateTime.now().toString());
    }

    private boolean processItem(Long userId, OfflineSyncQueue item) throws Exception {
        User user = userRepository.findById(userId).orElseThrow();
        JsonNode n = objectMapper.readTree(item.getPayload());
        switch (item.getEntityType()) {
            case MOOD_ENTRY -> moodRepo.save(MoodEntry.builder().user(user)
                    .mood(MoodEntry.MoodType.valueOf(n.path("mood").asText("NEUTRAL")))
                    .stressLevel(n.path("stressLevel").asInt(5)).anxietyLevel(n.path("anxietyLevel").asInt(5))
                    .sleepHours(n.path("sleepHours").asInt(7)).energyLevel(n.path("energyLevel").asInt(5))
                    .motivationLevel(n.path("motivationLevel").asInt(5)).focusLevel(n.path("focusLevel").asInt(5))
                    .entryDate(LocalDate.parse(n.path("entryDate").asText(LocalDate.now().toString()))).build());
            case JOURNAL_ENTRY -> journalRepo.save(JournalEntry.builder().user(user)
                    .title(n.path("title").asText("Offline Entry"))
                    .content(n.path("content").asText("")).isPrivate(true).build());
            case GRATITUDE_ENTRY -> gratitudeRepo.save(GratitudeEntry.builder().user(user)
                    .content(n.path("content").asText("")).category("Offline").build());
            case FOCUS_SESSION -> focusRepo.save(FocusSession.builder().user(user)
                    .durationMinutes(n.path("durationMinutes").asInt(25))
                    .completed(n.path("completed").asBoolean(true)).build());
            default -> { return false; }
        }
        return true;
    }

    @Override public List<OfflineSyncQueue> getPendingItems(Long userId) { return syncRepo.findByUserIdAndSyncedFalseOrderByCreatedAtAsc(userId); }
    @Override public long getPendingCount(Long userId) { return syncRepo.countByUserIdAndSyncedFalse(userId); }
}
