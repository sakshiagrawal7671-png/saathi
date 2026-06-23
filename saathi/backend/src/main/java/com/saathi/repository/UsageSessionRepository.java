package com.saathi.repository;
import com.saathi.entity.UsageSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
@Repository
public interface UsageSessionRepository extends JpaRepository<UsageSession, Long> {
    List<UsageSession> findByUserIdAndSessionDateOrderBySessionStartDesc(Long userId, LocalDate date);
    List<UsageSession> findByUserIdAndSessionDateBetween(Long userId, LocalDate start, LocalDate end);
    @Query("SELECT COALESCE(SUM(u.durationMinutes),0) FROM UsageSession u WHERE u.user.id=:userId AND u.sessionDate=:date")
    int sumMinutesForDate(Long userId, LocalDate date);
    Optional<UsageSession> findTopByUserIdAndSessionEndIsNullOrderBySessionStartDesc(Long userId);
}
