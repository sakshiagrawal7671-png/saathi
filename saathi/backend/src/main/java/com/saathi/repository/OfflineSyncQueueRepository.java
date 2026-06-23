package com.saathi.repository;
import com.saathi.entity.OfflineSyncQueue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface OfflineSyncQueueRepository extends JpaRepository<OfflineSyncQueue, Long> {
    List<OfflineSyncQueue> findByUserIdAndSyncedFalseOrderByCreatedAtAsc(Long userId);
    long countByUserIdAndSyncedFalse(Long userId);
}
