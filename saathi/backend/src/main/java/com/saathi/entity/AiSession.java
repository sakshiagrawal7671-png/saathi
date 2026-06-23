package com.saathi.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
@Entity @Table(name="ai_sessions") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AiSession {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="user_id",nullable=false) private User user;
    @Enumerated(EnumType.STRING) @Builder.Default private AiProvider provider = AiProvider.DEMO;
    @Column(columnDefinition="TEXT") private String systemContext;
    @Builder.Default private int messageCount = 0;
    @Builder.Default private boolean active = true;
    @Builder.Default private LocalDateTime createdAt = LocalDateTime.now();
    public enum AiProvider { OPENAI, GEMINI, DEMO }
}
