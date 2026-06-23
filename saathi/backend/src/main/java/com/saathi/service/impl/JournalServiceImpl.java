package com.saathi.service.impl;

import com.saathi.dto.request.JournalRequest;
import com.saathi.entity.JournalEntry;
import com.saathi.entity.User;
import com.saathi.exception.SaathiException;
import com.saathi.repository.JournalEntryRepository;
import com.saathi.repository.UserRepository;
import com.saathi.service.AiCompanionService;
import com.saathi.service.JournalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class JournalServiceImpl implements JournalService {

    private final JournalEntryRepository journalRepository;
    private final UserRepository userRepository;
    private final AiCompanionService aiCompanionService;

    @Override
    public JournalEntry createEntry(Long userId, JournalRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new SaathiException("User not found", HttpStatus.NOT_FOUND));

        JournalEntry entry = JournalEntry.builder()
                .user(user)
                .title(request.getTitle())
                .content(request.getContent())
                .mood(request.getMood())
                .isPrivate(request.isPrivate())
                .type(request.getType())
                .build();

        // AI Analysis
        if (request.getContent() != null && !request.getContent().isBlank()) {
            try {
                String analysis = aiCompanionService.analyzeText(request.getContent());
                entry.setAiAnalysis(analysis);

                String lower = request.getContent().toLowerCase();
                if (lower.contains("exhaust") || lower.contains("burnout") || lower.contains("can't go on"))
                    entry.setBurnoutRisk(true);

                int stressScore = calculateStressScore(lower);
                entry.setStressScore(stressScore);
                entry.setEmotionalTone(detectTone(lower));
            } catch (Exception e) {
                // AI analysis is optional - continue without it
            }
        }

        return journalRepository.save(entry);
    }

    @Override
    public JournalEntry updateEntry(Long userId, Long entryId, JournalRequest request) {
        JournalEntry entry = journalRepository.findById(entryId)
                .orElseThrow(() -> new SaathiException("Entry not found", HttpStatus.NOT_FOUND));
        if (!entry.getUser().getId().equals(userId))
            throw new SaathiException("Not authorized", HttpStatus.FORBIDDEN);

        entry.setTitle(request.getTitle());
        entry.setContent(request.getContent());
        entry.setMood(request.getMood());
        return journalRepository.save(entry);
    }

    @Override
    public void deleteEntry(Long userId, Long entryId) {
        JournalEntry entry = journalRepository.findById(entryId)
                .orElseThrow(() -> new SaathiException("Entry not found", HttpStatus.NOT_FOUND));
        if (!entry.getUser().getId().equals(userId))
            throw new SaathiException("Not authorized", HttpStatus.FORBIDDEN);
        journalRepository.delete(entry);
    }

    @Override
    public List<JournalEntry> getEntries(Long userId) {
        return journalRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Override
    public JournalEntry getEntry(Long userId, Long entryId) {
        JournalEntry entry = journalRepository.findById(entryId)
                .orElseThrow(() -> new SaathiException("Entry not found", HttpStatus.NOT_FOUND));
        if (!entry.getUser().getId().equals(userId))
            throw new SaathiException("Not authorized", HttpStatus.FORBIDDEN);
        return entry;
    }

    private int calculateStressScore(String text) {
        int score = 0;
        String[] stressWords = {"stress", "anxious", "overwhelm", "panic", "worry", "fear", "dread"};
        for (String word : stressWords) if (text.contains(word)) score += 2;
        return Math.min(10, score);
    }

    private String detectTone(String text) {
        if (text.contains("happy") || text.contains("joy") || text.contains("grateful")) return "POSITIVE";
        if (text.contains("sad") || text.contains("cry") || text.contains("hurt")) return "SAD";
        if (text.contains("angry") || text.contains("furious") || text.contains("frustrated")) return "ANGRY";
        if (text.contains("anxious") || text.contains("nervous") || text.contains("worry")) return "ANXIOUS";
        return "NEUTRAL";
    }
}
