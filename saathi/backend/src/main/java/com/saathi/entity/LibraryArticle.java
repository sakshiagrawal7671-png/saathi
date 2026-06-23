package com.saathi.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "library_articles")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LibraryArticle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Enumerated(EnumType.STRING)
    private LibraryType libraryType; // LIFE or HOPE

    @Enumerated(EnumType.STRING)
    private LibraryTheme theme;

    private String icon;
    private String colorTheme;
    private int readMinutes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id")
    private User author; // null = SAATHI curated

    @Builder.Default private boolean published = true;
    @Builder.Default private int displayOrder = 0;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum LibraryType { LIFE, HOPE }

    public enum LibraryTheme {
        COURAGE, HOPE, COMPASSION, PATIENCE, GRATITUDE, PURPOSE,
        PSYCHOLOGY, HUMAN_BEHAVIOUR, EMOTIONAL_INTELLIGENCE, LIFE_SKILLS,
        PERSONAL_GROWTH, RESILIENCE, OVERCOMING_FAILURE, OVERCOMING_LOSS,
        OVERCOMING_ADVERSITY, OVERCOMING_REJECTION
    }
}
