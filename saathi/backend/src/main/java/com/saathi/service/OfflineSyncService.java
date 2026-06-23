package com.saathi.service;
import com.saathi.entity.OfflineSyncQueue;
import java.util.List;
import java.util.Map;
public interface OfflineSyncService {
    OfflineSyncQueue queueItem(Long userId, String entityType, String payload, String operation);
    Map<String, Object> processSyncQueue(Long userId);
    List<OfflineSyncQueue> getPendingItems(Long userId);
    long getPendingCount(Long userId);
}
