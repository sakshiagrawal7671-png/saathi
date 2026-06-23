package com.saathi.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "expert_profiles")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ExpertProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Enumerated(EnumType.STRING)
    private ExpertType expertType;

    @Column(columnDefinition = "TEXT")
    private String credentials;

    @Column(columnDefinition = "TEXT")
    private String bio;

    private String specialization;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ApplicationStatus status = ApplicationStatus.PENDING;

    @Builder.Default private boolean verified = false;
    @Builder.Default private int contentCount = 0;
    @Builder.Default private int helpfulVotes = 0;

    @Builder.Default
    private LocalDateTime appliedAt = LocalDateTime.now();

    private LocalDateTime verifiedAt;

    public enum ExpertType {
        PSYCHOLOGIST, TEACHER, PROFESSOR, MENTOR, DOCTOR, CAREER_COACH
    }

    public enum ApplicationStatus { PENDING, APPROVED, REJECTED }
}
