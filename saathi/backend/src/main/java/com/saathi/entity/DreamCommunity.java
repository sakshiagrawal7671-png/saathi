package com.saathi.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "dream_communities")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DreamCommunity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;
    private String icon;
    private String colorTheme;

    @Enumerated(EnumType.STRING)
    private CommunityGoal goal;

    @Builder.Default
    private int memberCount = 0;

    @Builder.Default
    private boolean active = true;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum CommunityGoal {
        JEE, NEET, DEVELOPERS, ENTREPRENEURS, DESIGNERS, WRITERS, FITNESS, MEDITATION, LANGUAGE_LEARNING, GENERAL
    }
}
