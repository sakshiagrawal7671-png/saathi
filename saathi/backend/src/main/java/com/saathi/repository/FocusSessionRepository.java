package com.saathi.repository;
import com.saathi.entity.FocusSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
@Repository
public interface FocusSessionRepository extends JpaRepository<FocusSession, Long> {
    List<FocusSession> findByUserIdOrderByStartedAtDesc(Long userId);
    @Query("SELECT COALESCE(SUM(f.durationMinutes), 0) FROM FocusSession f WHERE f.user.id = :userId AND f.completed = true AND f.startedAt >= :since")
    int sumCompletedMinutesSince(Long userId, LocalDateTime since);
}
