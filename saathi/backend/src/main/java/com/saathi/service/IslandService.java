package com.saathi.service;
import com.saathi.entity.PersonalIsland;
import java.util.Map;
public interface IslandService {
    PersonalIsland getIsland(Long userId);
    Map<String, Object> getIslandStatus(Long userId);
    void refreshUnlocks(Long userId);
    PersonalIsland setEnvironment(Long userId, String timeOfDay, String weather);
}
