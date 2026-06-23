package com.saathi.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "anon_questions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AnonQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String question;

    @Enumerated(EnumType.STRING)
    private QuestionCategory category;

    @Builder.Default
    private int answerCount = 0;

    @Builder.Default
    private int supportCount = 0;

    @Builder.Default
    private boolean flagged = false;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum QuestionCategory {
        CAREER, STUDIES, RELATIONSHIPS, MENTAL_HEALTH, FAMILY, FINANCE, LIFE_ADVICE, GENERAL
    }
}
