package com.saathi.repository;
import com.saathi.entity.DailySurprise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
@Repository
public interface DailySurpriseRepository extends JpaRepository<DailySurprise, Long> {
    List<DailySurprise> findByUserIdAndSurpriseDate(Long userId, LocalDate date);
    Optional<DailySurprise> findByUserIdAndSurpriseDateAndType(Long userId, LocalDate date, DailySurprise.SurpriseType type);
    long countByUserIdAndCompletedTrue(Long userId);
}
