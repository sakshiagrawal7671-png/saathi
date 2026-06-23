package com.saathi.repository;
import com.saathi.entity.PersonalityAssessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
@Repository
public interface PersonalityAssessmentRepository extends JpaRepository<PersonalityAssessment, Long> {
    Optional<PersonalityAssessment> findByUserId(Long userId);
    boolean existsByUserId(Long userId);
}
