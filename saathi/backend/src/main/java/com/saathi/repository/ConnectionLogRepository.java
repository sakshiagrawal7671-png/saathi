package com.saathi.repository;
import com.saathi.entity.ConnectionLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
@Repository
public interface ConnectionLogRepository extends JpaRepository<ConnectionLog, Long> {
    List<ConnectionLog> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<ConnectionLog> findByUserIdAndLogDateBetween(Long userId, LocalDate start, LocalDate end);
    long countByUserIdAndLogDateBetween(Long userId, LocalDate start, LocalDate end);
    long countByUserIdAndTypeAndLogDateBetween(Long userId, ConnectionLog.ConnectionType type, LocalDate start, LocalDate end);
}
