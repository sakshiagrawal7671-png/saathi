package com.saathi.repository;
import com.saathi.entity.LifeMapEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface LifeMapEntryRepository extends JpaRepository<LifeMapEntry, Long> {
    List<LifeMapEntry> findByUserIdOrderBySectionAscOrderIndexAsc(Long userId);
    List<LifeMapEntry> findByUserIdAndSectionOrderByOrderIndexAsc(Long userId, LifeMapEntry.MapSection section);
}
