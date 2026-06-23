package com.saathi.service.impl;

import com.saathi.entity.LifeChapter;
import com.saathi.entity.User;
import com.saathi.exception.SaathiException;
import com.saathi.repository.LifeChapterRepository;
import com.saathi.repository.UserRepository;
import com.saathi.service.LifeJourneyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LifeJourneyServiceImpl implements LifeJourneyService {

    private final LifeChapterRepository chapterRepository;
    private final UserRepository userRepository;

    private static final List<String[]> CHAPTER_TEMPLATES = List.of(
        new String[]{"Finding Yourself",    "Your story begins. Who are you beneath the surface?"},
        new String[]{"Building Habits",     "Small daily actions are forging your character."},
        new String[]{"Facing Challenges",   "Every obstacle is a lesson wearing a disguise."},
        new String[]{"Growing Stronger",    "You are not the same person who started this journey."},
        new String[]{"Creating Impact",     "Your growth ripples outward — you are changing lives."}
    );

    @Override
    public void initializeChapters(Long userId) {
        if (!chapterRepository.findByUserIdOrderByChapterNumberAsc(userId).isEmpty()) return;
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new SaathiException("User not found", HttpStatus.NOT_FOUND));

        List<LifeChapter> chapters = new ArrayList<>();
        for (int i = 0; i < CHAPTER_TEMPLATES.size(); i++) {
            String[] t = CHAPTER_TEMPLATES.get(i);
            LifeChapter ch = LifeChapter.builder()
                    .user(user)
                    .chapterNumber(i + 1)
                    .title(t[0])
                    .story(t[1])
                    .status(i == 0 ? LifeChapter.ChapterStatus.IN_PROGRESS : LifeChapter.ChapterStatus.LOCKED)
                    .build();
            chapters.add(ch);
        }
        chapterRepository.saveAll(chapters);
    }

    @Override
    public List<LifeChapter> getChapters(Long userId) {
        List<LifeChapter> chapters = chapterRepository.findByUserIdOrderByChapterNumberAsc(userId);
        if (chapters.isEmpty()) {
            initializeChapters(userId);
            chapters = chapterRepository.findByUserIdOrderByChapterNumberAsc(userId);
        }
        return chapters;
    }

    @Override
    public LifeChapter getCurrentChapter(Long userId) {
        return chapterRepository.findTopByUserIdAndStatusOrderByChapterNumberAsc(
                userId, LifeChapter.ChapterStatus.IN_PROGRESS).orElse(null);
    }

    @Override
    public LifeChapter updateChapterStory(Long userId, int chapterNumber, String story, String milestone) {
        LifeChapter chapter = chapterRepository.findByUserIdAndChapterNumber(userId, chapterNumber)
                .orElseThrow(() -> new SaathiException("Chapter not found", HttpStatus.NOT_FOUND));
        if (!chapter.getUser().getId().equals(userId))
            throw new SaathiException("Not authorized", HttpStatus.FORBIDDEN);
        if (story != null) chapter.setStory(story);
        if (milestone != null) chapter.setMilestone(milestone);
        return chapterRepository.save(chapter);
    }

    @Override
    public LifeChapter completeChapter(Long userId, int chapterNumber) {
        LifeChapter chapter = chapterRepository.findByUserIdAndChapterNumber(userId, chapterNumber)
                .orElseThrow(() -> new SaathiException("Chapter not found", HttpStatus.NOT_FOUND));

        chapter.setStatus(LifeChapter.ChapterStatus.COMPLETED);
        chapter.setCompletedAt(LocalDateTime.now());
        chapterRepository.save(chapter);

        // Unlock next chapter
        chapterRepository.findByUserIdAndChapterNumber(userId, chapterNumber + 1).ifPresent(next -> {
            next.setStatus(LifeChapter.ChapterStatus.IN_PROGRESS);
            chapterRepository.save(next);
        });

        return chapter;
    }
}
