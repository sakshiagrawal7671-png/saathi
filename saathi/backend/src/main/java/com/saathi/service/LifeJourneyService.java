package com.saathi.service;

import com.saathi.entity.LifeChapter;
import java.util.List;

public interface LifeJourneyService {
    List<LifeChapter> getChapters(Long userId);
    LifeChapter getCurrentChapter(Long userId);
    LifeChapter updateChapterStory(Long userId, int chapterNumber, String story, String milestone);
    LifeChapter completeChapter(Long userId, int chapterNumber);
    void initializeChapters(Long userId);
}
