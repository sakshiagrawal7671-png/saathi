package com.saathi.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
@Entity @Table(name="usage_sessions") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UsageSession {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="user_id",nullable=false) private User user;
    @Builder.Default private LocalDateTime sessionStart = LocalDateTime.now();
    private LocalDateTime sessionEnd;
    @Builder.Default private int durationMinutes = 0;
    private LocalDate sessionDate;
    @Builder.Default private LocalDateTime createdAt = LocalDateTime.now();
}
