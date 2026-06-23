package com.saathi.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "personal_islands")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PersonalIsland {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    // Unlock flags for island structures
    @Builder.Default private boolean familyHouseUnlocked = true;   // unlocked by default
    @Builder.Default private boolean memoryLakeUnlocked = false;   // gratitude
    @Builder.Default private boolean gratitudeGardenUnlocked = false;
    @Builder.Default private boolean dreamTowerUnlocked = false;
    @Builder.Default private boolean petAreaUnlocked = false;
    @Builder.Default private boolean wisdomLibraryUnlocked = false;
    @Builder.Default private boolean hopeBridgeUnlocked = false;
    @Builder.Default private boolean focusForestUnlocked = false;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private TimeOfDay timeOfDay = TimeOfDay.DAY;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Weather weather = Weather.SUNNY;

    @Builder.Default private int islandLevel = 1;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum TimeOfDay { DAWN, DAY, DUSK, NIGHT }
    public enum Weather { SUNNY, CLOUDY, RAINY, STARRY }
}
