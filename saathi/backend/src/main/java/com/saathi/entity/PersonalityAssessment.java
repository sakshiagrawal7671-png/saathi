package com.saathi.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "personality_assessments")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PersonalityAssessment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    // Big Five scores (0-100)
    private int opennessScore;
    private int conscientiousnessScore;
    private int extraversionScore;
    private int agreeablenessScore;
    private int neuroticismScore;

    // Derived labels
    private String opennessLabel;
    private String conscientiousnessLabel;
    private String extraversionLabel;
    private String agreeablenessLabel;
    private String neuroticismLabel;

    // Overall profile
    private String personalityType;       // e.g. "The Visionary"
    private String personalitySummary;

    @Column(columnDefinition = "TEXT")
    private String strengths;

    @Column(columnDefinition = "TEXT")
    private String growthAreas;

    @Column(columnDefinition = "TEXT")
    private String careerMatches;

    @Column(columnDefinition = "TEXT")
    private String relationshipStyle;

    @Builder.Default
    private boolean completed = false;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime completedAt;
}
