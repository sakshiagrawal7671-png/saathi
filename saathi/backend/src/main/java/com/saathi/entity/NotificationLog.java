package com.saathi.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notification_logs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class NotificationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String title;
    private String body;

    @Enumerated(EnumType.STRING)
    private NotificationType type;

    @Builder.Default private boolean read = false;
    @Builder.Default private boolean sent = false;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum NotificationType {
        DAILY_CHECK_IN, MOOD_REMINDER, HABIT_REMINDER, FAMILY_NUDGE,
        DAILY_SURPRISE, COMMUNITY_REPLY, ACHIEVEMENT, SYSTEM
    }
}
