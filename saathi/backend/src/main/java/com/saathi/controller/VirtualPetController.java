package com.saathi.controller;

import com.saathi.dto.response.ApiResponse;
import com.saathi.entity.VirtualPet;
import com.saathi.repository.UserRepository;
import com.saathi.service.VirtualPetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/pet")
@RequiredArgsConstructor
public class VirtualPetController {

    private final VirtualPetService petService;
    private final UserRepository userRepository;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<VirtualPet>> create(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam String name,
            @RequestParam VirtualPet.PetType petType) {
        return ResponseEntity.ok(ApiResponse.success("Your pet is here! 🐾",
                petService.createPet(getUserId(userDetails), name, petType)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStatus(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(petService.getPetStatus(getUserId(userDetails))));
    }

    @PostMapping("/feed")
    public ResponseEntity<ApiResponse<VirtualPet>> feed(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Your pet loved that! 🍎",
                petService.feedPet(getUserId(userDetails))));
    }

    @PostMapping("/play")
    public ResponseEntity<ApiResponse<VirtualPet>> play(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Your pet is so happy! 🎉",
                petService.playWithPet(getUserId(userDetails))));
    }

    private Long getUserId(UserDetails ud) {
        return userRepository.findByEmail(ud.getUsername()).orElseThrow().getId();
    }
}
