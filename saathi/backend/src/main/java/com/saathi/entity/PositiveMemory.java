package com.saathi.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "positive_memories")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PositiveMemory {

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
    private MemoryCategory category;

    private String emoji;
    private LocalDate memoryDate;

    @Builder.Default
    private boolean pinned = false;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum MemoryCategory {
        ACHIEVEMENT, FAMILY_MOMENT, FRIENDSHIP, ADVENTURE, MILESTONE,
        KINDNESS_RECEIVED, LOVE, PERSONAL_GROWTH, NATURE, CELEBRATION, OTHER
    }
}
