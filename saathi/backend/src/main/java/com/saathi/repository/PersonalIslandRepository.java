package com.saathi.repository;
import com.saathi.entity.PersonalIsland;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
@Repository
public interface PersonalIslandRepository extends JpaRepository<PersonalIsland, Long> {
    Optional<PersonalIsland> findByUserId(Long userId);
    boolean existsByUserId(Long userId);
}
