package com.saathi.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "life_chapters")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LifeChapter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private int chapterNumber;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String story;

    @Column(columnDefinition = "TEXT")
    private String milestone;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ChapterStatus status = ChapterStatus.IN_PROGRESS;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime completedAt;

    public enum ChapterStatus { LOCKED, IN_PROGRESS, COMPLETED }
}
