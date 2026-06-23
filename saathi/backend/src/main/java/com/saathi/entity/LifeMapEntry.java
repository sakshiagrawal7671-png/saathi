package com.saathi.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "life_map_entries")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LifeMapEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    private MapSection section;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private int orderIndex;

    @Builder.Default
    private boolean completed = false;

    private LocalDate targetDate;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum MapSection {
        CURRENT_POSITION, SHORT_TERM_GOAL, LONG_TERM_GOAL, DREAM_LIFE_VISION
    }
}
