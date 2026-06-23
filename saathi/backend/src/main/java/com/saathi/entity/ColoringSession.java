package com.saathi.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "coloring_sessions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ColoringSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String templateName;
    private int durationMinutes;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
