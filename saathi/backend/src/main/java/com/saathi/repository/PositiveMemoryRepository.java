package com.saathi.repository;
import com.saathi.entity.PositiveMemory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface PositiveMemoryRepository extends JpaRepository<PositiveMemory, Long> {
    List<PositiveMemory> findByUserIdOrderByMemoryDateDescCreatedAtDesc(Long userId);
    List<PositiveMemory> findByUserIdAndPinnedTrueOrderByCreatedAtDesc(Long userId);
    List<PositiveMemory> findByUserIdAndCategoryOrderByCreatedAtDesc(Long userId, PositiveMemory.MemoryCategory category);
    long countByUserId(Long userId);
}
