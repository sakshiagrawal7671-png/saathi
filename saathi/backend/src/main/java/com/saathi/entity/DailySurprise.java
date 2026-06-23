package com.saathi.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "daily_surprises")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DailySurprise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    private SurpriseType type;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    private String icon;
    private LocalDate surpriseDate;

    @Builder.Default private boolean opened = false;
    @Builder.Default private boolean completed = false;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum SurpriseType {
        WISDOM_CARD, KINDNESS_MISSION, REFLECTION_PROMPT, FAMILY_CHALLENGE, GRATITUDE_CHALLENGE
    }
}
