package com.saathi.repository;
import com.saathi.entity.ValueCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface ValueCardRepository extends JpaRepository<ValueCard, Long> {
    List<ValueCard> findByUserIdOrderByPriorityAsc(Long userId);
    void deleteByUserId(Long userId);
}
