package com.saathi.repository;

import com.saathi.entity.DreamEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DreamEntryRepository extends JpaRepository<DreamEntry, Long> {
    List<DreamEntry> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<DreamEntry> findByUserIdAndCategory(Long userId, DreamEntry.DreamCategory category);
}
