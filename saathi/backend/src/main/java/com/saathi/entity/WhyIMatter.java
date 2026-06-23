package com.saathi.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "why_i_matter")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class WhyIMatter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(columnDefinition = "TEXT")
    private String peopleWhoLoveMe;

    @Column(columnDefinition = "TEXT")
    private String peopleILove;

    @Column(columnDefinition = "TEXT")
    private String myDreams;

    @Column(columnDefinition = "TEXT")
    private String myAchievements;

    @Column(columnDefinition = "TEXT")
    private String happyMemories;

    @Column(columnDefinition = "TEXT")
    private String futureGoals;

    @Column(columnDefinition = "TEXT")
    private String myStrengths;

    @Builder.Default
    private int completionPercent = 0;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() { this.updatedAt = LocalDateTime.now(); }
}
