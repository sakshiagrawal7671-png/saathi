package com.saathi.service.impl;

import com.saathi.entity.*;
import com.saathi.exception.SaathiException;
import com.saathi.repository.*;
import com.saathi.service.InnerCircleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class InnerCircleServiceImpl implements InnerCircleService {

    private final InnerCircleMemberRepository circleRepo;
    private final UserRepository userRepository;

    @Override
    public InnerCircleMember addMember(Long userId, String name, String relationship, String avatarEmoji,
                                        String phone, String sharedMemories, String importantDate, String importantDateLabel) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new SaathiException("User not found", HttpStatus.NOT_FOUND));

        long count = circleRepo.findByUserIdOrderByNameAsc(userId).size();
        if (count >= 10) throw new SaathiException("Inner circle limited to 10 people", HttpStatus.BAD_REQUEST);

        LocalDate date = null;
        try { if (importantDate != null && !importantDate.isBlank()) date = LocalDate.parse(importantDate); } catch (Exception ignored) {}

        return circleRepo.save(InnerCircleMember.builder()
                .user(user).name(name).relationship(relationship)
                .avatarEmoji(avatarEmoji != null ? avatarEmoji : "🧑")
                .phone(phone).sharedMemories(sharedMemories)
                .importantDate(date).importantDateLabel(importantDateLabel).build());
    }

    @Override
    public List<InnerCircleMember> getCircle(Long userId) {
        return circleRepo.findByUserIdOrderByNameAsc(userId);
    }

    @Override
    public InnerCircleMember updateMember(Long userId, Long memberId, Map<String, String> fields) {
        InnerCircleMember m = circleRepo.findById(memberId)
                .orElseThrow(() -> new SaathiException("Member not found", HttpStatus.NOT_FOUND));
        if (!m.getUser().getId().equals(userId))
            throw new SaathiException("Not authorized", HttpStatus.FORBIDDEN);
        if (fields.containsKey("sharedMemories")) m.setSharedMemories(fields.get("sharedMemories"));
        if (fields.containsKey("phone")) m.setPhone(fields.get("phone"));
        if (fields.containsKey("importantDate")) {
            try { m.setImportantDate(LocalDate.parse(fields.get("importantDate"))); } catch (Exception ignored) {}
        }
        if (fields.containsKey("importantDateLabel")) m.setImportantDateLabel(fields.get("importantDateLabel"));
        return circleRepo.save(m);
    }

    @Override
    public void removeMember(Long userId, Long memberId) {
        InnerCircleMember m = circleRepo.findById(memberId)
                .orElseThrow(() -> new SaathiException("Member not found", HttpStatus.NOT_FOUND));
        if (!m.getUser().getId().equals(userId))
            throw new SaathiException("Not authorized", HttpStatus.FORBIDDEN);
        circleRepo.delete(m);
    }

    @Override
    public void recordInteraction(Long userId, Long memberId) {
        circleRepo.findById(memberId).ifPresent(m -> {
            m.setLastInteractionAt(LocalDateTime.now());
            circleRepo.save(m);
        });
    }
}
