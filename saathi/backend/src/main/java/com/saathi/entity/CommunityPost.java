package com.saathi.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "community_posts")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CommunityPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Enumerated(EnumType.STRING)
    private PostCategory category;

    @Builder.Default
    private boolean anonymous = false;

    @Builder.Default
    private int supportCount = 0;

    @Builder.Default
    private boolean flagged = false;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum PostCategory {
        VENTING, QUESTION, PEER_SUPPORT, GROWTH, CAREER, STUDIES, RELATIONSHIP, GENERAL
    }
}
