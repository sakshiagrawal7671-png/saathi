package com.saathi.repository;
import com.saathi.entity.ExpertContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface ExpertContentRepository extends JpaRepository<ExpertContent, Long> {
    List<ExpertContent> findByPublishedTrueOrderByCreatedAtDesc();
    List<ExpertContent> findByExpertIdOrderByCreatedAtDesc(Long expertId);
}
