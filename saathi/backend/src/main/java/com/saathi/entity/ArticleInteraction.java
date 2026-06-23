package com.saathi.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "article_interactions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ArticleInteraction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "article_id", nullable = false)
    private LibraryArticle article;

    @Builder.Default private boolean read = false;
    @Builder.Default private boolean bookmarked = false;
    @Builder.Default private boolean foundHelpful = false;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
