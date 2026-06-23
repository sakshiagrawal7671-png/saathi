package com.saathi.service.impl;

import com.saathi.entity.*;
import com.saathi.exception.SaathiException;
import com.saathi.repository.*;
import com.saathi.service.ReasonsToLiveService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class ReasonsToLiveServiceImpl implements ReasonsToLiveService {

    private final ReasonsToLiveRepository reasonsRepo;
    private final WhyIMatterRepository whyRepo;
    private final UserRepository userRepository;

    @Override
    public ReasonsToLive addReason(Long userId, ReasonsToLive.ReasonCategory category, String content, String emoji) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new SaathiException("User not found", HttpStatus.NOT_FOUND));
        return reasonsRepo.save(ReasonsToLive.builder()
                .user(user).category(category).content(content).emoji(emoji != null ? emoji : "💜").build());
    }

    @Override
    public List<ReasonsToLive> getReasons(Long userId) {
        return reasonsRepo.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Override
    public void deleteReason(Long userId, Long reasonId) {
        ReasonsToLive r = reasonsRepo.findById(reasonId)
                .orElseThrow(() -> new SaathiException("Not found", HttpStatus.NOT_FOUND));
        if (!r.getUser().getId().equals(userId))
            throw new SaathiException("Not authorized", HttpStatus.FORBIDDEN);
        reasonsRepo.delete(r);
    }

    @Override
    public WhyIMatter getWhyIMatter(Long userId) {
        return whyRepo.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new SaathiException("User not found", HttpStatus.NOT_FOUND));
            return whyRepo.save(WhyIMatter.builder().user(user).build());
        });
    }

    @Override
    public WhyIMatter updateWhyIMatter(Long userId, Map<String, String> fields) {
        WhyIMatter w = getWhyIMatter(userId);
        if (fields.containsKey("peopleWhoLoveMe")) w.setPeopleWhoLoveMe(fields.get("peopleWhoLoveMe"));
        if (fields.containsKey("peopleILove"))     w.setPeopleILove(fields.get("peopleILove"));
        if (fields.containsKey("myDreams"))         w.setMyDreams(fields.get("myDreams"));
        if (fields.containsKey("myAchievements"))   w.setMyAchievements(fields.get("myAchievements"));
        if (fields.containsKey("happyMemories"))    w.setHappyMemories(fields.get("happyMemories"));
        if (fields.containsKey("futureGoals"))      w.setFutureGoals(fields.get("futureGoals"));
        if (fields.containsKey("myStrengths"))      w.setMyStrengths(fields.get("myStrengths"));

        int filled = 0;
        for (String v : new String[]{ w.getPeopleWhoLoveMe(), w.getPeopleILove(), w.getMyDreams(),
                w.getMyAchievements(), w.getHappyMemories(), w.getFutureGoals(), w.getMyStrengths() })
            if (v != null && !v.isBlank()) filled++;
        w.setCompletionPercent((filled * 100) / 7);
        return whyRepo.save(w);
    }

    @Override
    public Map<String, Object> getVaultStatus(Long userId) {
        long count = reasonsRepo.countByUserId(userId);
        WhyIMatter w = getWhyIMatter(userId);

        Map<String, Long> byCategory = new LinkedHashMap<>();
        for (ReasonsToLive.ReasonCategory cat : ReasonsToLive.ReasonCategory.values())
            byCategory.put(cat.name(), (long) reasonsRepo.findByUserIdAndCategory(userId, cat).size()); // Fixed: casted int to long

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("totalReasons", count);
        result.put("byCategory", byCategory);
        result.put("whyIMatterCompletion", w.getCompletionPercent());
        result.put("vaultLevel", count < 3 ? "STARTING" : count < 10 ? "GROWING" : count < 20 ? "STRONG" : "THRIVING");
        return result;
    }
}