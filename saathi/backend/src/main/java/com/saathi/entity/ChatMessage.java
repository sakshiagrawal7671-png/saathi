package com.saathi.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_messages")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    private MessageRole role;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private EmotionTag emotionTag = EmotionTag.NEUTRAL;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum MessageRole { USER, ASSISTANT }
    public enum EmotionTag { NEUTRAL, HAPPY, SAD, ANXIOUS, ANGRY, HOPEFUL, STRESSED, CRISIS }
}
