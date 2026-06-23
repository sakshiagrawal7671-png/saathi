package com.saathi.repository;

import com.saathi.entity.Achievement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AchievementRepository extends JpaRepository<Achievement, Long> {
    List<Achievement> findByUserIdOrderByUnlockedAtDesc(Long userId);
    boolean existsByUserIdAndType(Long userId, Achievement.AchievementType type);
}
