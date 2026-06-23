package com.saathi.service;

import com.saathi.entity.NotificationLog;
import com.saathi.entity.NotificationPreference;
import java.util.List;
import java.util.Map;

public interface NotificationService {
    void registerToken(Long userId, String token, String deviceType);
    void unregisterToken(String token);
    NotificationPreference getPreferences(Long userId);
    NotificationPreference updatePreferences(Long userId, Map<String, Object> fields);
    NotificationLog sendNotification(Long userId, String title, String body, NotificationLog.NotificationType type);
    List<NotificationLog> getNotifications(Long userId);
    void markAllRead(Long userId);
    long getUnreadCount(Long userId);
}
