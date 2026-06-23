package com.saathi.repository;
import com.saathi.entity.HabitLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
@Repository
public interface HabitLogRepository extends JpaRepository<HabitLog, Long> {
    List<HabitLog> findByUserIdAndLogDate(Long userId, LocalDate date);
    Optional<HabitLog> findByHabitIdAndLogDate(Long habitId, LocalDate date);
}
