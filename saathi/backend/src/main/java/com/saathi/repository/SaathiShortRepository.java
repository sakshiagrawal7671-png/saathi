package com.saathi.repository;
import com.saathi.entity.SaathiShort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface SaathiShortRepository extends JpaRepository<SaathiShort, Long> {
    List<SaathiShort> findAllByOrderByDisplayOrderAsc();
    List<SaathiShort> findByCategoryOrderByDisplayOrderAsc(SaathiShort.ShortCategory category);
}
