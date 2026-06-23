package com.saathi.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "achievements")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Achievement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String title;

    private String description;
    private String icon;
    private String badgeColor;

    @Enumerated(EnumType.STRING)
    private AchievementType type;

    @Builder.Default
    private LocalDateTime unlockedAt = LocalDateTime.now();

    public enum AchievementType {
        FIRST_JOURNAL, STREAK_7, STREAK_30, MOOD_MASTER, HABIT_HERO,
        FAMILY_CONNECTOR, GRATITUDE_GURU, FOCUS_CHAMPION, COMMUNITY_HELPER,
        LEVEL_5, LEVEL_10, LEVEL_20, COMPANION_FRIEND, GOAL_ACHIEVER
    }
}
