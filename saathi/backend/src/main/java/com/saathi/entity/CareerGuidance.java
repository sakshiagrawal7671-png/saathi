package com.saathi.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "career_guidances")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CareerGuidance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private String currentRole;
    private String educationLevel;
    private String fieldOfStudy;

    @Column(columnDefinition = "TEXT")
    private String skills;              // comma-separated

    @Column(columnDefinition = "TEXT")
    private String interests;

    @Column(columnDefinition = "TEXT")
    private String careerGoal;

    @Column(columnDefinition = "TEXT")
    private String recommendedCareers;  // JSON array string

    @Column(columnDefinition = "TEXT")
    private String skillRoadmap;        // AI-generated roadmap

    @Column(columnDefinition = "TEXT")
    private String learningResources;   // AI-generated resources

    @Column(columnDefinition = "TEXT")
    private String actionPlan;          // 90-day action plan

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() { this.updatedAt = LocalDateTime.now(); }
}
