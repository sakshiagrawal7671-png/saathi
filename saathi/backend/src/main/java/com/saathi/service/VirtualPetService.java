package com.saathi.service;

import com.saathi.entity.VirtualPet;
import java.util.Map;

public interface VirtualPetService {
    VirtualPet createPet(Long userId, String name, VirtualPet.PetType petType);
    VirtualPet getPet(Long userId);
    VirtualPet feedPet(Long userId);
    VirtualPet playWithPet(Long userId);
    Map<String, Object> getPetStatus(Long userId);
    void updatePetFromActivity(Long userId, int happinessBoost, int xpBoost);
}
