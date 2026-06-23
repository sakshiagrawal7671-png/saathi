package com.saathi.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "dream_entries")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DreamEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    private DreamCategory category;

    private String imageUrl;

    @Builder.Default
    private int progressPercent = 0;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum DreamCategory {
        CAREER, HOME, TRAVEL, LIFESTYLE, RELATIONSHIP, HEALTH, EDUCATION, CREATIVE, FINANCIAL, OTHER
    }
}
