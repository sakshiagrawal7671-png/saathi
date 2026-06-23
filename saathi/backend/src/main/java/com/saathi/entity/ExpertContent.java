package com.saathi.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "expert_content")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ExpertContent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "expert_id", nullable = false)
    private ExpertProfile expert;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Enumerated(EnumType.STRING)
    private LibraryArticle.LibraryTheme theme;

    private String icon;
    @Builder.Default private int helpfulCount = 0;
    @Builder.Default private boolean published = true;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
