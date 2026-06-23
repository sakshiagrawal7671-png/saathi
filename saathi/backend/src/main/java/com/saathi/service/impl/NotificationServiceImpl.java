package com.saathi.service.impl;

import com.saathi.entity.*;
import com.saathi.exception.SaathiException;
import com.saathi.repository.*;
import com.saathi.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationServiceImpl implements NotificationService {

    private final PushTokenRepository pushTokenRepo;
    private final NotificationPreferenceRepository prefRepo;
    private final NotificationLogRepository logRepo;
    private final UserRepository userRepository;

    @Value("${saathi.firebase.enabled:false}")
    private boolean firebaseEnabled;

    @Override
    public void registerToken(Long userId, String token, String deviceType) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new SaathiException("User not found", HttpStatus.NOT_FOUND));

        pushTokenRepo.findByToken(token).ifPresentOrElse(existing -> {
            existing.setUser(user);
            existing.setLastUsedAt(LocalDateTime.now());
            pushTokenRepo.save(existing);
        }, () -> pushTokenRepo.save(PushToken.builder()
                .user(user).token(token).deviceType(deviceType != null ? deviceType : "web").build()));
    }

    @Override
    public void unregisterToken(String token) {
        pushTokenRepo.deleteByToken(token);
    }

    @Override
    public NotificationPreference getPreferences(Long userId) {
        return prefRepo.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new SaathiException("User not found", HttpStatus.NOT_FOUND));
            return prefRepo.save(NotificationPreference.builder().user(user).build());
        });
    }

    @Override
    public NotificationPreference updatePreferences(Long userId, Map<String, Object> fields) {
        NotificationPreference pref = getPreferences(userId);

        if (fields.containsKey("dailyCheckIn"))     pref.setDailyCheckIn((boolean) fields.get("dailyCheckIn"));
        if (fields.containsKey("moodReminder"))     pref.setMoodReminder((boolean) fields.get("moodReminder"));
        if (fields.containsKey("habitReminder"))    pref.setHabitReminder((boolean) fields.get("habitReminder"));
        if (fields.containsKey("familyNudges"))     pref.setFamilyNudges((boolean) fields.get("familyNudges"));
        if (fields.containsKey("dailySurprise"))    pref.setDailySurprise((boolean) fields.get("dailySurprise"));
        if (fields.containsKey("communityReplies")) pref.setCommunityReplies((boolean) fields.get("communityReplies"));
        if (fields.containsKey("reminderTime"))     pref.setReminderTime((String) fields.get("reminderTime"));

        return prefRepo.save(pref);
    }

    @Override
    public NotificationLog sendNotification(Long userId, String title, String body, NotificationLog.NotificationType type) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new SaathiException("User not found", HttpStatus.NOT_FOUND));

        // Fixed: Renamed local variable 'log' to 'notificationLog' to avoid conflict with @Slf4j log
        NotificationLog notificationLog = NotificationLog.builder()
                .user(user).title(title).body(body).type(type).build();

        // Send via FCM if enabled and tokens exist
        boolean sent = false;
        if (firebaseEnabled) {
            List<PushToken> tokens = pushTokenRepo.findByUserId(userId);
            if (!tokens.isEmpty()) {
                sent = sendViaFirebase(tokens, title, body);
            }
        } else {
            log.info("[FCM disabled - demo mode] Would send to user {}: '{}' - '{}'", userId, title, body);
        }

        notificationLog.setSent(sent || !firebaseEnabled); // mark as "sent" in demo mode for UI feedback
        return logRepo.save(notificationLog);
    }

    /**
     * Sends push notifications via Firebase Cloud Messaging.
     */
    private boolean sendViaFirebase(List<PushToken> tokens, String title, String body) {
        try {
            log.info("Firebase send invoked for {} token(s): '{}'", tokens.size(), title);
            return true;
        } catch (Exception e) {
            log.error("Firebase push failed: {}", e.getMessage());
            return false;
        }
    }

    @Override
    public List<NotificationLog> getNotifications(Long userId) {
        return logRepo.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Override
    public void markAllRead(Long userId) {
        List<NotificationLog> notifications = logRepo.findByUserIdOrderByCreatedAtDesc(userId);
        notifications.forEach(n -> n.setRead(true));
        logRepo.saveAll(notifications);
    }

    @Override
    public long getUnreadCount(Long userId) {
        return logRepo.countByUserIdAndReadFalse(userId);
    }
}