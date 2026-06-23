package com.saathi.repository;
import com.saathi.entity.ShortView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
@Repository
public interface ShortViewRepository extends JpaRepository<ShortView, Long> {
    List<ShortView> findByUserIdAndViewDate(Long userId, LocalDate date);
    Optional<ShortView> findByUserIdAndSaathiShortIdAndViewDate(Long userId, Long shortId, LocalDate date);
    List<ShortView> findByUserIdAndSavedTrue(Long userId);
    long countByUserIdAndViewDate(Long userId, LocalDate date);
}
