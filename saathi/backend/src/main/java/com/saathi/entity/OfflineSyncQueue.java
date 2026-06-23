package com.saathi.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
@Entity @Table(name="offline_sync_queue") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class OfflineSyncQueue {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="user_id",nullable=false) private User user;
    @Enumerated(EnumType.STRING) private SyncEntityType entityType;
    @Column(columnDefinition="TEXT",nullable=false) private String payload;
    @Column(nullable=false) private String operation;
    @Builder.Default private boolean synced = false;
    @Builder.Default private int retryCount = 0;
    @Builder.Default private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime syncedAt;
    public enum SyncEntityType { MOOD_ENTRY, JOURNAL_ENTRY, HABIT_LOG, GRATITUDE_ENTRY, GOAL, FOCUS_SESSION, CONNECTION_LOG }
}
