package com.saathi.service.impl;

import com.saathi.entity.User;
import com.saathi.entity.VirtualPet;
import com.saathi.exception.SaathiException;
import com.saathi.repository.UserRepository;
import com.saathi.repository.VirtualPetRepository;
import com.saathi.service.GamificationService;
import com.saathi.service.VirtualPetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class VirtualPetServiceImpl implements VirtualPetService {

    private final VirtualPetRepository petRepository;
    private final UserRepository userRepository;
    private final GamificationService gamificationService;

    @Override
    public VirtualPet createPet(Long userId, String name, VirtualPet.PetType petType) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new SaathiException("User not found", HttpStatus.NOT_FOUND));
        if (petRepository.existsByUserId(userId))
            throw new SaathiException("You already have a pet!", HttpStatus.CONFLICT);

        VirtualPet pet = VirtualPet.builder()
                .user(user).name(name).petType(petType)
                .lastInteractedAt(LocalDateTime.now()).build();
        return petRepository.save(pet);
    }

    @Override
    public VirtualPet getPet(Long userId) {
        return petRepository.findByUserId(userId).orElse(null);
    }

    @Override
    public VirtualPet feedPet(Long userId) {
        VirtualPet pet = getPetOrThrow(userId);
        pet.setEnergy(Math.min(100, pet.getEnergy() + 15));
        pet.setHappiness(Math.min(100, pet.getHappiness() + 5));
        pet.setLastInteractedAt(LocalDateTime.now());
        updateStage(pet);
        gamificationService.awardXP(userId, 5, "Fed your pet");
        return petRepository.save(pet);
    }

    @Override
    public VirtualPet playWithPet(Long userId) {
        VirtualPet pet = getPetOrThrow(userId);
        pet.setHappiness(Math.min(100, pet.getHappiness() + 20));
        pet.setEnergy(Math.max(0, pet.getEnergy() - 10));
        pet.setTotalXp(pet.getTotalXp() + 10);
        pet.setLastInteractedAt(LocalDateTime.now());
        updateStage(pet);
        gamificationService.awardXP(userId, 5, "Played with your pet");
        return petRepository.save(pet);
    }

    @Override
    public void updatePetFromActivity(Long userId, int happinessBoost, int xpBoost) {
        petRepository.findByUserId(userId).ifPresent(pet -> {
            pet.setHappiness(Math.min(100, pet.getHappiness() + happinessBoost));
            pet.setTotalXp(pet.getTotalXp() + xpBoost);
            pet.setLastInteractedAt(LocalDateTime.now());
            updateStage(pet);
            petRepository.save(pet);
        });
    }

    @Override
    public Map<String, Object> getPetStatus(Long userId) {
        VirtualPet pet = petRepository.findByUserId(userId).orElse(null);
        Map<String, Object> status = new HashMap<>();
        if (pet == null) {
            status.put("hasPet", false);
            return status;
        }

        // Decay happiness if not interacted recently
        if (pet.getLastInteractedAt() != null) {
            long hoursAway = java.time.Duration.between(pet.getLastInteractedAt(), LocalDateTime.now()).toHours();
            if (hoursAway > 12) {
                int decay = (int) Math.min(30, hoursAway / 4);
                pet.setHappiness(Math.max(20, pet.getHappiness() - decay));
                petRepository.save(pet);
            }
        }

        String petEmoji = switch (pet.getPetType()) {
            case DOG -> "🐶"; case CAT -> "🐱"; case PANDA -> "🐼";
            case RABBIT -> "🐰"; case FOX -> "🦊";
        };

        String moodMsg;
        if (pet.getHappiness() >= 80) moodMsg = "I'm so happy to see you! 💜";
        else if (pet.getHappiness() >= 60) moodMsg = "I missed you! How are you doing?";
        else if (pet.getHappiness() >= 40) moodMsg = "I'm a little lonely. Spend some time with me?";
        else moodMsg = "Welcome back! I was waiting for you. 🌟";

        status.put("hasPet", true);
        status.put("pet", pet);
        status.put("emoji", petEmoji);
        status.put("message", moodMsg);
        status.put("stageLabel", switch (pet.getStage()) {
            case BABY -> "Baby"; case YOUNG -> "Young"; case ADULT -> "Adult"; case WISE_ELDER -> "Wise Elder";
        });
        return status;
    }

    private VirtualPet getPetOrThrow(Long userId) {
        return petRepository.findByUserId(userId)
                .orElseThrow(() -> new SaathiException("No pet found. Create one first!", HttpStatus.NOT_FOUND));
    }

    private void updateStage(VirtualPet pet) {
        VirtualPet.PetStage newStage;
        if (pet.getTotalXp() >= 500) newStage = VirtualPet.PetStage.WISE_ELDER;
        else if (pet.getTotalXp() >= 200) newStage = VirtualPet.PetStage.ADULT;
        else if (pet.getTotalXp() >= 50) newStage = VirtualPet.PetStage.YOUNG;
        else newStage = VirtualPet.PetStage.BABY;
        pet.setStage(newStage);
    }
}
