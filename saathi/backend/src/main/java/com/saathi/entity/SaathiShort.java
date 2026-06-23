package com.saathi.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "saathi_shorts")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SaathiShort {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Enumerated(EnumType.STRING)
    private ShortCategory category;

    private String icon;
    private String colorTheme;

    @Builder.Default
    private int displayOrder = 0;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum ShortCategory {
        STUDY_TIP, LIFE_LESSON, EMOTIONAL_WELLBEING, CAREER_ADVICE, FAMILY_RELATIONSHIP
    }
}
