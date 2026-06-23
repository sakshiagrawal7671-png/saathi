package com.saathi.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "notification_preferences")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class NotificationPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Builder.Default private boolean dailyCheckIn = true;
    @Builder.Default private boolean moodReminder = true;
    @Builder.Default private boolean habitReminder = true;
    @Builder.Default private boolean familyNudges = true;
    @Builder.Default private boolean dailySurprise = true;
    @Builder.Default private boolean communityReplies = true;
    @Builder.Default private String reminderTime = "20:00"; // HH:mm
}
