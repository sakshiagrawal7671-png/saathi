package com.saathi.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "inner_circle_members")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class InnerCircleMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String name;

    private String relationship;
    private String avatarEmoji;
    private String phone;

    @Column(columnDefinition = "TEXT")
    private String sharedMemories;

    private LocalDate importantDate;
    private String importantDateLabel;

    private LocalDateTime lastInteractionAt;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
