package com.saathi.service.impl;

import com.saathi.entity.*;
import com.saathi.exception.SaathiException;
import com.saathi.repository.*;
import com.saathi.service.PurposeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class PurposeServiceImpl implements PurposeService {

    private final PurposeProfileRepository purposeRepo;
    private final ValueCardRepository valueCardRepo;
    private final UserRepository userRepository;
    private final PersonalityAssessmentRepository personalityRepo;

    @Override
    public PurposeProfile getOrCreate(Long userId) {
        return purposeRepo.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new SaathiException("User not found", HttpStatus.NOT_FOUND));
            return purposeRepo.save(PurposeProfile.builder().user(user).build());
        });
    }

    @Override
    public PurposeProfile update(Long userId, Map<String, String> fields) {
        PurposeProfile profile = getOrCreate(userId);

        if (fields.containsKey("coreValues"))       profile.setCoreValues(fields.get("coreValues"));
        if (fields.containsKey("topStrengths"))      profile.setTopStrengths(fields.get("topStrengths"));
        if (fields.containsKey("passions"))          profile.setPassions(fields.get("passions"));
        if (fields.containsKey("impactStatement"))   profile.setImpactStatement(fields.get("impactStatement"));
        if (fields.containsKey("futureSelfVision"))  profile.setFutureSelfVision(fields.get("futureSelfVision"));
        if (fields.containsKey("legacyStatement"))   profile.setLegacyStatement(fields.get("legacyStatement"));

        // Calculate completion
        int filled = 0;
        if (notBlank(profile.getCoreValues()))      filled++;
        if (notBlank(profile.getTopStrengths()))    filled++;
        if (notBlank(profile.getPassions()))        filled++;
        if (notBlank(profile.getImpactStatement())) filled++;
        if (notBlank(profile.getFutureSelfVision()))filled++;
        if (notBlank(profile.getLegacyStatement())) filled++;
        profile.setCompletionPercent((filled * 100) / 6);

        return purposeRepo.save(profile);
    }

    @Override
    public PurposeProfile generatePurposeStatement(Long userId) {
        PurposeProfile profile = getOrCreate(userId);

        // Build purpose statement from filled fields
        StringBuilder sb = new StringBuilder();

        if (notBlank(profile.getCoreValues()))
            sb.append("Guided by the values of ").append(profile.getCoreValues()).append(", ");

        if (notBlank(profile.getTopStrengths()))
            sb.append("and using my strengths in ").append(profile.getTopStrengths()).append(", ");

        if (notBlank(profile.getImpactStatement()))
            sb.append(profile.getImpactStatement()).append(". ");

        if (notBlank(profile.getPassions()))
            sb.append("I am deeply passionate about ").append(profile.getPassions()).append(". ");

        if (notBlank(profile.getLegacyStatement()))
            sb.append("Ultimately, ").append(profile.getLegacyStatement()).append(".");

        if (sb.length() < 30) {
            sb = new StringBuilder("I am on a journey of meaningful growth, using my unique gifts to " +
                    "make a positive difference — in my own life and in the lives of those around me.");
        }

        // Generate next steps
        List<String> steps = new ArrayList<>();
        if (!notBlank(profile.getCoreValues()))       steps.add("Define your top 3-5 core values");
        if (!notBlank(profile.getTopStrengths()))     steps.add("Identify your greatest strengths");
        if (!notBlank(profile.getFutureSelfVision())) steps.add("Write a vivid 5-year vision");
        if (!notBlank(profile.getImpactStatement()))  steps.add("Clarify the impact you want to make");
        if (steps.isEmpty()) {
            steps.add("Share your purpose with one person you trust");
            steps.add("Take one small action aligned with your purpose today");
            steps.add("Review and refine your purpose statement monthly");
        }

        // Enrich with personality if available
        personalityRepo.findByUserId(userId).ifPresent(pa -> {
            if (notBlank(pa.getPersonalityType()))
                profile.setTopStrengths(
                    notBlank(profile.getTopStrengths()) ? profile.getTopStrengths() : pa.getStrengths());
        });

        profile.setPurposeStatement(sb.toString());
        profile.setNextSteps(String.join(" | ", steps));
        profile.setCompletionPercent(Math.max(profile.getCompletionPercent(), 60));

        return purposeRepo.save(profile);
    }

    @Override
    public List<ValueCard> getValues(Long userId) {
        return valueCardRepo.findByUserIdOrderByPriorityAsc(userId);
    }

    @Override
    @Transactional
    public void saveValues(Long userId, List<Map<String, Object>> values) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new SaathiException("User not found", HttpStatus.NOT_FOUND));
        valueCardRepo.deleteByUserId(userId);
        List<ValueCard> cards = new ArrayList<>();
        for (int i = 0; i < values.size(); i++) {
            Map<String, Object> v = values.get(i);
            cards.add(ValueCard.builder()
                    .user(user)
                    .value((String) v.get("value"))
                    .description((String) v.getOrDefault("description", ""))
                    .priority(i + 1)
                    .build());
        }
        valueCardRepo.saveAll(cards);
    }

    @Override
    public Map<String, Object> getFullProfile(Long userId) {
        Map<String, Object> result = new HashMap<>();
        result.put("profile", getOrCreate(userId));
        result.put("values", getValues(userId));
        personalityRepo.findByUserId(userId).ifPresent(pa -> result.put("personality", pa));
        return result;
    }

    private boolean notBlank(String s) { return s != null && !s.isBlank(); }
}
