package com.saathi.service.impl;

import com.saathi.entity.*;
import com.saathi.exception.SaathiException;
import com.saathi.repository.*;
import com.saathi.service.ExpertService;
import com.saathi.service.GamificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ExpertServiceImpl implements ExpertService {

    private final ExpertProfileRepository expertRepo;
    private final ExpertContentRepository contentRepo;
    private final UserRepository userRepository;
    private final GamificationService gamificationService;

    @Override
    public ExpertProfile applyAsExpert(Long userId, ExpertProfile.ExpertType type, String credentials, String bio, String specialization) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new SaathiException("User not found", HttpStatus.NOT_FOUND));

        ExpertProfile profile = expertRepo.findByUserId(userId)
                .orElseGet(() -> ExpertProfile.builder().user(user).build());

        profile.setExpertType(type);
        profile.setCredentials(credentials);
        profile.setBio(bio);
        profile.setSpecialization(specialization);
        profile.setStatus(ExpertProfile.ApplicationStatus.PENDING);
        profile.setVerified(false);

        return expertRepo.save(profile);
    }

    @Override
    public ExpertProfile getMyApplication(Long userId) {
        return expertRepo.findByUserId(userId).orElse(null);
    }

    @Override
    public ExpertContent createContent(Long userId, String title, String content, String theme, String icon) {
        ExpertProfile expert = expertRepo.findByUserId(userId)
                .orElseThrow(() -> new SaathiException("You are not a registered expert", HttpStatus.FORBIDDEN));

        if (!expert.isVerified())
            throw new SaathiException("Your expert application is pending verification", HttpStatus.FORBIDDEN);

        ExpertContent ec = ExpertContent.builder()
                .expert(expert).title(title).content(content)
                .theme(theme != null ? LibraryArticle.LibraryTheme.valueOf(theme) : LibraryArticle.LibraryTheme.LIFE_SKILLS)
                .icon(icon != null ? icon : "📝")
                .build();

        ec = contentRepo.save(ec);

        expert.setContentCount(expert.getContentCount() + 1);
        expertRepo.save(expert);

        gamificationService.awardXP(userId, 20, "Published expert content");

        return ec;
    }

    @Override
    public List<ExpertContent> getAllContent() {
        return contentRepo.findByPublishedTrueOrderByCreatedAtDesc();
    }

    @Override
    public List<ExpertContent> getMyContent(Long userId) {
        ExpertProfile expert = expertRepo.findByUserId(userId).orElse(null);
        if (expert == null) return List.of();
        return contentRepo.findByExpertIdOrderByCreatedAtDesc(expert.getId());
    }

    @Override
    public ExpertContent markHelpful(Long contentId) {
        ExpertContent ec = contentRepo.findById(contentId)
                .orElseThrow(() -> new SaathiException("Content not found", HttpStatus.NOT_FOUND));
        ec.setHelpfulCount(ec.getHelpfulCount() + 1);

        ExpertProfile expert = ec.getExpert();
        expert.setHelpfulVotes(expert.getHelpfulVotes() + 1);
        expertRepo.save(expert);

        return contentRepo.save(ec);
    }

    @Override
    public List<ExpertProfile> getPendingApplications() {
        return expertRepo.findByStatus(ExpertProfile.ApplicationStatus.PENDING);
    }

    @Override
    public ExpertProfile reviewApplication(Long expertId, boolean approve) {
        ExpertProfile expert = expertRepo.findById(expertId)
                .orElseThrow(() -> new SaathiException("Application not found", HttpStatus.NOT_FOUND));

        expert.setStatus(approve ? ExpertProfile.ApplicationStatus.APPROVED : ExpertProfile.ApplicationStatus.REJECTED);
        expert.setVerified(approve);
        if (approve) expert.setVerifiedAt(LocalDateTime.now());

        if (approve) gamificationService.awardXP(expert.getUser().getId(), 50, "Expert verification approved");

        return expertRepo.save(expert);
    }

    @Override
    public Map<String, Object> getExpertStats(Long userId) {
        ExpertProfile expert = expertRepo.findByUserId(userId).orElse(null);
        Map<String, Object> stats = new HashMap<>();
        if (expert == null) {
            stats.put("isExpert", false);
            return stats;
        }
        stats.put("isExpert", true);
        stats.put("verified", expert.isVerified());
        stats.put("status", expert.getStatus());
        stats.put("contentCount", expert.getContentCount());
        stats.put("helpfulVotes", expert.getHelpfulVotes());
        stats.put("expertType", expert.getExpertType());
        return stats;
    }
}
