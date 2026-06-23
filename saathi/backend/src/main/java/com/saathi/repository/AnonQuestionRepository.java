package com.saathi.repository;
import com.saathi.entity.AnonQuestion;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface AnonQuestionRepository extends JpaRepository<AnonQuestion, Long> {
    List<AnonQuestion> findByFlaggedFalseOrderByCreatedAtDesc(Pageable pageable);
    List<AnonQuestion> findByCategoryAndFlaggedFalseOrderByCreatedAtDesc(AnonQuestion.QuestionCategory cat, Pageable pageable);
    List<AnonQuestion> findByUserIdOrderByCreatedAtDesc(Long userId);
}
