package com.saathi.repository;
import com.saathi.entity.ColoringSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface ColoringSessionRepository extends JpaRepository<ColoringSession, Long> {
    List<ColoringSession> findByUserIdOrderByCreatedAtDesc(Long userId);
    @Query("SELECT COALESCE(SUM(c.durationMinutes),0) FROM ColoringSession c WHERE c.user.id=:userId")
    int sumMinutesByUserId(Long userId);
    long countByUserId(Long userId);
}
