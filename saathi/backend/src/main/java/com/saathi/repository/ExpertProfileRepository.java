package com.saathi.repository;
import com.saathi.entity.ExpertProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
@Repository
public interface ExpertProfileRepository extends JpaRepository<ExpertProfile, Long> {
    Optional<ExpertProfile> findByUserId(Long userId);
    List<ExpertProfile> findByStatus(ExpertProfile.ApplicationStatus status);
    List<ExpertProfile> findByVerifiedTrue();
}
