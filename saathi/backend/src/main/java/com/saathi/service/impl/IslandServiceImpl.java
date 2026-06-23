package com.saathi.service.impl;

import com.saathi.entity.*;
import com.saathi.exception.SaathiException;
import com.saathi.repository.*;
import com.saathi.service.IslandService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class IslandServiceImpl implements IslandService {

    private final PersonalIslandRepository islandRepo;
    private final UserRepository userRepository;
    private final GratitudeEntryRepository gratitudeRepo;
    private final DreamEntryRepository dreamRepo;
    private final VirtualPetRepository petRepo;
    private final FocusSessionRepository focusRepo;
    private final PersonalityAssessmentRepository personalityRepo;
    private final ConnectionLogRepository connectionRepo;

    @Override
    public PersonalIsland getIsland(Long userId) {
        return islandRepo.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new SaathiException("User not found", HttpStatus.NOT_FOUND));
            return islandRepo.save(PersonalIsland.builder().user(user).build());
        });
    }

    @Override
    public void refreshUnlocks(Long userId) {
        PersonalIsland island = getIsland(userId);

        // Memory Lake — unlocked via gratitude entries
        long gratitudes = gratitudeRepo.countByUserId(userId);
        island.setMemoryLakeUnlocked(gratitudes >= 1);
        island.setGratitudeGardenUnlocked(gratitudes >= 5);

        // Dream Tower — unlocked via dreams
        island.setDreamTowerUnlocked(!dreamRepo.findByUserIdOrderByCreatedAtDesc(userId).isEmpty());

        // Pet Area — unlocked via virtual pet
        island.setPetAreaUnlocked(petRepo.existsByUserId(userId));

        // Wisdom Library — unlocked via personality assessment
        island.setWisdomLibraryUnlocked(personalityRepo.existsByUserId(userId));

        // Focus Forest — unlocked via focus sessions
        int focusMinutes = focusRepo.sumCompletedMinutesSince(userId, LocalDateTime.now().minusYears(10));
        island.setFocusForestUnlocked(focusMinutes >= 25);

        // Hope Bridge — unlocked via connection logs (helping others / community)
        long connectionCount = connectionRepo.findByUserIdOrderByCreatedAtDesc(userId).size();
        island.setHopeBridgeUnlocked(connectionCount >= 3);

        // Island level — based on number of unlocks
        int unlocks = countUnlocks(island);
        island.setIslandLevel(Math.max(1, unlocks));

        // Time of day based on real time
        int hour = LocalDateTime.now().getHour();
        if (hour >= 5 && hour < 8) island.setTimeOfDay(PersonalIsland.TimeOfDay.DAWN);
        else if (hour >= 8 && hour < 18) island.setTimeOfDay(PersonalIsland.TimeOfDay.DAY);
        else if (hour >= 18 && hour < 21) island.setTimeOfDay(PersonalIsland.TimeOfDay.DUSK);
        else island.setTimeOfDay(PersonalIsland.TimeOfDay.NIGHT);

        islandRepo.save(island);
    }

    private int countUnlocks(PersonalIsland i) {
        int c = 0;
        if (i.isFamilyHouseUnlocked()) c++;
        if (i.isMemoryLakeUnlocked()) c++;
        if (i.isGratitudeGardenUnlocked()) c++;
        if (i.isDreamTowerUnlocked()) c++;
        if (i.isPetAreaUnlocked()) c++;
        if (i.isWisdomLibraryUnlocked()) c++;
        if (i.isHopeBridgeUnlocked()) c++;
        if (i.isFocusForestUnlocked()) c++;
        return c;
    }

    @Override
    public Map<String, Object> getIslandStatus(Long userId) {
        refreshUnlocks(userId);
        PersonalIsland island = getIsland(userId);

        List<Map<String, Object>> structures = new ArrayList<>();
        structures.add(structure("Family House", "🏠", island.isFamilyHouseUnlocked(),
                "Always open — your roots and the people who love you", "/family"));
        structures.add(structure("Memory Lake", "🌊", island.isMemoryLakeUnlocked(),
                "Reflects your gratitude — add gratitude entries to fill it", "/gratitude"));
        structures.add(structure("Gratitude Garden", "🌸", island.isGratitudeGardenUnlocked(),
                "Blooms with 5+ gratitude entries", "/gratitude"));
        structures.add(structure("Dream Tower", "🏰", island.isDreamTowerUnlocked(),
                "Rises with every dream you add", "/dreams"));
        structures.add(structure("Pet Area", "🐾", island.isPetAreaUnlocked(),
                "Home to your virtual companion", "/pet"));
        structures.add(structure("Wisdom Library", "📚", island.isWisdomLibraryUnlocked(),
                "Unlocked by completing your personality assessment", "/personality"));
        structures.add(structure("Hope Bridge", "🌉", island.isHopeBridgeUnlocked(),
                "Built from acts of connection — log 3 to unlock", "/connection"));
        structures.add(structure("Focus Forest", "🌳", island.isFocusForestUnlocked(),
                "Grows from your focus sessions", "/focus"));

        long unlockedCount = structures.stream().filter(s -> (boolean) s.get("unlocked")).count();

        Map<String, Object> status = new HashMap<>();
        status.put("island", island);
        status.put("structures", structures);
        status.put("unlockedCount", unlockedCount);
        status.put("totalCount", structures.size());
        status.put("islandLevel", island.getIslandLevel());
        status.put("timeOfDay", island.getTimeOfDay());
        status.put("weather", island.getWeather());
        return status;
    }

    private Map<String, Object> structure(String name, String icon, boolean unlocked, String desc, String link) {
        Map<String, Object> m = new HashMap<>();
        m.put("name", name); m.put("icon", icon); m.put("unlocked", unlocked);
        m.put("description", desc); m.put("link", link);
        return m;
    }

    @Override
    public PersonalIsland setEnvironment(Long userId, String timeOfDay, String weather) {
        PersonalIsland island = getIsland(userId);
        if (timeOfDay != null) island.setTimeOfDay(PersonalIsland.TimeOfDay.valueOf(timeOfDay));
        if (weather != null) island.setWeather(PersonalIsland.Weather.valueOf(weather));
        return islandRepo.save(island);
    }
}
