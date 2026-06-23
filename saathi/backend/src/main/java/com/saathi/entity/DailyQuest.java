package com.saathi.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "daily_quests")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DailyQuest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String title;

    private String description;

    @Enumerated(EnumType.STRING)
    private QuestType type;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private QuestStatus status = QuestStatus.ACTIVE;

    private int xpReward;
    private LocalDate questDate;

    @Builder.Default
    private boolean completed = false;

    private LocalDateTime completedAt;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum QuestType {
        MOOD_LOG, JOURNAL, HABIT, GRATITUDE, FAMILY_CONTACT, FOCUS_SESSION,
        COMMUNITY_POST, COMPANION_CHAT, GOAL_PROGRESS, DAILY_LOGIN
    }

    public enum QuestStatus { ACTIVE, COMPLETED, EXPIRED }
}
