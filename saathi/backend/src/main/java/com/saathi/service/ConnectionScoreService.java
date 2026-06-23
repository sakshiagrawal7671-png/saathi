package com.saathi.service;
import com.saathi.entity.ConnectionLog;
import java.util.List;
import java.util.Map;
public interface ConnectionScoreService {
    ConnectionLog logConnection(Long userId, ConnectionLog.ConnectionType type, String description);
    Map<String, Object> getScore(Long userId);
    List<ConnectionLog> getRecentLogs(Long userId);
}
