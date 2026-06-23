package com.saathi.repository;
import com.saathi.entity.MoodEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
@Repository
public interface MoodEntryRepository extends JpaRepository<MoodEntry, Long> {
    List<MoodEntry> findByUserIdOrderByEntryDateDesc(Long userId);
    List<MoodEntry> findByUserIdAndEntryDateBetweenOrderByEntryDateAsc(Long userId, LocalDate start, LocalDate end);
    boolean existsByUserIdAndEntryDate(Long userId, LocalDate date);
    @Query("SELECT AVG(m.stressLevel) FROM MoodEntry m WHERE m.user.id = :userId AND m.entryDate >= :since")
    Double findAvgStressSince(Long userId, LocalDate since);
}
