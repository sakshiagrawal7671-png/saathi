package com.saathi.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "short_views")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ShortView {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "short_id", nullable = false)
    private SaathiShort saathiShort;

    private LocalDate viewDate;

    @Builder.Default private boolean liked = false;
    @Builder.Default private boolean saved = false;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
