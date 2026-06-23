package com.saathi.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "virtual_pets")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class VirtualPet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    private PetType petType;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private PetStage stage = PetStage.BABY;

    @Builder.Default
    private int happiness = 80;

    @Builder.Default
    private int energy = 80;

    @Builder.Default
    private int totalXp = 0;

    @Builder.Default
    private String mood = "HAPPY";

    private LocalDateTime lastInteractedAt;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum PetType { DOG, CAT, PANDA, RABBIT, FOX }

    public enum PetStage { BABY, YOUNG, ADULT, WISE_ELDER }
}
