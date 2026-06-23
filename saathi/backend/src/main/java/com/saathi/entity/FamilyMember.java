package com.saathi.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "family_members")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class FamilyMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String name;
    private String relationship;
    private String phone;
    private String email;
    private String avatarUrl;
    private LocalDate birthday;

    @Column(length = 500)
    private String notes;

    private LocalDateTime lastContactedAt;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
