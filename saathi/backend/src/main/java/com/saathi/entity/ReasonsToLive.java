package com.saathi.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reasons_to_live")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ReasonsToLive {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    private ReasonCategory category;

    @Column(nullable = false, length = 500)
    private String content;

    private String emoji;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum ReasonCategory {
        DREAM, GOAL, FAMILY_MEMORY, FUTURE_PLAN, PERSON_I_LOVE, EXPERIENCE, PROMISE_TO_SELF, PLACE, OTHER
    }
}
