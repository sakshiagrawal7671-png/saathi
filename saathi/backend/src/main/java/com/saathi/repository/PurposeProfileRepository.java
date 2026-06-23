package com.saathi.repository;
import com.saathi.entity.PurposeProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
@Repository
public interface PurposeProfileRepository extends JpaRepository<PurposeProfile, Long> {
    Optional<PurposeProfile> findByUserId(Long userId);
    boolean existsByUserId(Long userId);
}
