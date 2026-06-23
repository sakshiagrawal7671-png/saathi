package com.saathi.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
@Entity @Table(name="digital_detox_goals") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DigitalDetoxGoal {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @OneToOne(fetch=FetchType.LAZY) @JoinColumn(name="user_id",nullable=false,unique=true) private User user;
    @Builder.Default private int dailyLimitMinutes = 60;
    @Builder.Default private boolean breakRemindersEnabled = true;
    @Builder.Default private int breakIntervalMinutes = 25;
    @Builder.Default private boolean weekendDetoxEnabled = false;
    @Column(columnDefinition="TEXT") private String detoxActivities;
    @Builder.Default private LocalDateTime createdAt = LocalDateTime.now();
    @Builder.Default private LocalDateTime updatedAt = LocalDateTime.now();
    @PreUpdate public void preUpdate() { this.updatedAt = LocalDateTime.now(); }
}
