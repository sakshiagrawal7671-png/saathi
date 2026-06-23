package com.saathi.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "journal_entries")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class JournalEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    private MoodEntry.MoodType mood;

    @Builder.Default
    private boolean isPrivate = true;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private JournalType type = JournalType.TEXT;

    private String audioUrl;          // path/URL to stored audio file (optional)

    @Column(columnDefinition = "TEXT")
    private String audioTranscript;   // browser Web Speech API transcript

    // AI Analysis
    @Column(columnDefinition = "TEXT")
    private String aiAnalysis;
    private String emotionalTone;
    private int stressScore;
    private boolean burnoutRisk;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() { this.updatedAt = LocalDateTime.now(); }

    public enum JournalType { TEXT, VOICE, PHOTO }
}
