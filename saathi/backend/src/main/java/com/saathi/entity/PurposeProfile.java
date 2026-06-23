package com.saathi.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "purpose_profiles")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PurposeProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(columnDefinition = "TEXT")
    private String coreValues;          // comma-separated

    @Column(columnDefinition = "TEXT")
    private String topStrengths;

    @Column(columnDefinition = "TEXT")
    private String passions;

    @Column(columnDefinition = "TEXT")
    private String impactStatement;     // "I want to..."

    @Column(columnDefinition = "TEXT")
    private String futureSelfVision;    // 5-year vision

    @Column(columnDefinition = "TEXT")
    private String legacyStatement;     // "I want to be remembered for..."

    @Column(columnDefinition = "TEXT")
    private String purposeStatement;    // AI-generated synthesis

    @Column(columnDefinition = "TEXT")
    private String nextSteps;           // actionable steps

    @Builder.Default
    private int completionPercent = 0;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() { this.updatedAt = LocalDateTime.now(); }
}
