package com.saathi.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "value_cards")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ValueCard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String value;         // e.g. "Family", "Creativity"

    private String description;   // personal meaning
    private int priority;         // 1=highest

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
