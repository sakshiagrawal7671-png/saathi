package com.saathi.repository;
import com.saathi.entity.AnonAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface AnonAnswerRepository extends JpaRepository<AnonAnswer, Long> {
    List<AnonAnswer> findByQuestionIdOrderByCreatedAtAsc(Long questionId);
}
