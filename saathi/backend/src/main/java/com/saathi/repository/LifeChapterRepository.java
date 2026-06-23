package com.saathi.repository;

import com.saathi.entity.LifeChapter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface LifeChapterRepository extends JpaRepository<LifeChapter, Long> {
    List<LifeChapter> findByUserIdOrderByChapterNumberAsc(Long userId);
    Optional<LifeChapter> findByUserIdAndChapterNumber(Long userId, int chapterNumber);
    Optional<LifeChapter> findTopByUserIdAndStatusOrderByChapterNumberAsc(Long userId, LifeChapter.ChapterStatus status);
}
