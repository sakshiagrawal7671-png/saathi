package com.saathi.repository;
import com.saathi.entity.ReasonsToLive;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface ReasonsToLiveRepository extends JpaRepository<ReasonsToLive, Long> {
    List<ReasonsToLive> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<ReasonsToLive> findByUserIdAndCategory(Long userId, ReasonsToLive.ReasonCategory category);
    long countByUserId(Long userId);
}
