package com.saathi.repository;
import com.saathi.entity.WhyIMatter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
@Repository
public interface WhyIMatterRepository extends JpaRepository<WhyIMatter, Long> {
    Optional<WhyIMatter> findByUserId(Long userId);
}
