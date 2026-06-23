package com.saathi.repository;
import com.saathi.entity.GratitudeEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface GratitudeEntryRepository extends JpaRepository<GratitudeEntry, Long> {
    List<GratitudeEntry> findByUserIdOrderByCreatedAtDesc(Long userId);
    long countByUserId(Long userId);
}
