package com.saathi.repository;

import com.saathi.entity.DailyQuest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface DailyQuestRepository extends JpaRepository<DailyQuest, Long> {
    List<DailyQuest> findByUserIdAndQuestDate(Long userId, LocalDate date);
    List<DailyQuest> findByUserIdOrderByCreatedAtDesc(Long userId);
    boolean existsByUserIdAndTypeAndQuestDate(Long userId, DailyQuest.QuestType type, LocalDate date);
    long countByUserIdAndStatus(Long userId, DailyQuest.QuestStatus status);
}
