package com.saathi.repository;

import com.saathi.entity.VirtualPet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface VirtualPetRepository extends JpaRepository<VirtualPet, Long> {
    Optional<VirtualPet> findByUserId(Long userId);
    boolean existsByUserId(Long userId);
}
