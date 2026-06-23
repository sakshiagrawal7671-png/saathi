package com.saathi.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "connection_logs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ConnectionLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    private ConnectionType type;

    private String description;

    private LocalDate logDate;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum ConnectionType {
        FAMILY_CONTACT, MEANINGFUL_CONVERSATION, KINDNESS_ACT,
        COMMUNITY_SUPPORT, FRIEND_CONNECTION, GRATITUDE_SHARED, COMPANION_CHAT
    }
}
