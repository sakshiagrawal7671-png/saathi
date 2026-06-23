package com.saathi.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "mood_entries")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MoodEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    private MoodType mood;

    private int stressLevel;    // 1-10
    private int anxietyLevel;   // 1-10
    private int sleepHours;     // 0-12
    private int energyLevel;    // 1-10
    private int motivationLevel;// 1-10
    private int focusLevel;     // 1-10

    @Column(length = 500)
    private String note;

    private LocalDate entryDate;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum MoodType {
        VERY_HAPPY, HAPPY, NEUTRAL, SAD, VERY_SAD, ANXIOUS, ANGRY, HOPEFUL, TIRED, CALM
    }
}
