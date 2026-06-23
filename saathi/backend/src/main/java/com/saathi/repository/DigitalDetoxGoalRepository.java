package com.saathi.repository;
import com.saathi.entity.DigitalDetoxGoal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
@Repository
public interface DigitalDetoxGoalRepository extends JpaRepository<DigitalDetoxGoal, Long> {
    Optional<DigitalDetoxGoal> findByUserId(Long userId);
}
