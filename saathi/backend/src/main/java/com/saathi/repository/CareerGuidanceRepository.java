package com.saathi.repository;
import com.saathi.entity.CareerGuidance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
@Repository
public interface CareerGuidanceRepository extends JpaRepository<CareerGuidance, Long> {
    Optional<CareerGuidance> findByUserId(Long userId);
    boolean existsByUserId(Long userId);
}
