package com.saathi.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "personality_questions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PersonalityQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String questionText;

    @Enumerated(EnumType.STRING)
    private BigFiveTrait trait;

    private boolean reversed; // reverse-scored questions

    private int orderIndex;

    public enum BigFiveTrait {
        OPENNESS, CONSCIENTIOUSNESS, EXTRAVERSION, AGREEABLENESS, NEUROTICISM
    }
}
