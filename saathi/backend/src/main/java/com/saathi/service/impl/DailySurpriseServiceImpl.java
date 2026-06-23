package com.saathi.service.impl;

import com.saathi.entity.*;
import com.saathi.exception.SaathiException;
import com.saathi.repository.*;
import com.saathi.service.DailySurpriseService;
import com.saathi.service.GamificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class DailySurpriseServiceImpl implements DailySurpriseService {

    private final DailySurpriseRepository surpriseRepo;
    private final UserRepository userRepository;
    private final GamificationService gamificationService;

    private static final List<String[]> WISDOM_CARDS = List.of(
        new String[]{"You are exactly where you need to be to grow into who you're becoming.", "🌱"},
        new String[]{"Rest is not a reward for finishing — it's a requirement for continuing.", "🌙"},
        new String[]{"The way you talk to yourself matters more than you think.", "💭"},
        new String[]{"Small steps in the right direction are still steps in the right direction.", "👣"},
        new String[]{"Your sensitivity is not a weakness — it's a sign you're paying attention.", "💗"},
        new String[]{"You don't have to see the whole staircase to take the first step.", "🪜"},
        new String[]{"Healing isn't linear, and that's okay.", "🌊"},
        new String[]{"You've survived 100% of your worst days so far.", "🛡️"},
        new String[]{"Comparison steals joy. Your journey is uniquely yours.", "🧭"},
        new String[]{"Today doesn't have to be productive to be valuable.", "🍃"}
    );

    private static final List<String[]> KINDNESS_MISSIONS = List.of(
        new String[]{"Send a genuinely kind message to someone you haven't talked to in a while", "💌"},
        new String[]{"Compliment a stranger or coworker on something specific you noticed", "✨"},
        new String[]{"Leave an encouraging comment for someone in the community", "🌟"},
        new String[]{"Tell someone exactly why you appreciate them", "❤️"},
        new String[]{"Offer to help someone with something small today", "🤝"},
        new String[]{"Forgive yourself for one thing you've been holding onto", "🕊️"},
        new String[]{"Share a resource or piece of advice that helped you with someone who needs it", "🎁"}
    );

    private static final List<String[]> REFLECTION_PROMPTS = List.of(
        new String[]{"What is one thing that went better than expected this week?", "🔍"},
        new String[]{"If your younger self could see you now, what would they be proud of?", "👶"},
        new String[]{"What's a fear you've outgrown?", "🦋"},
        new String[]{"Who is someone that believes in you? Have you told them how much that means?", "🌟"},
        new String[]{"What would you do today if you knew you couldn't fail?", "🚀"},
        new String[]{"What's a lesson a difficult experience taught you?", "📖"},
        new String[]{"Describe a moment recently when you felt truly present.", "🧘"}
    );

    private static final List<String[]> FAMILY_CHALLENGES = List.of(
        new String[]{"Call a family member and ask about a childhood memory of theirs", "📞"},
        new String[]{"Share a happy memory with a family member today", "📸"},
        new String[]{"Thank a parent or guardian for something specific they did", "🙏"},
        new String[]{"Ask a grandparent or older relative for one piece of life advice", "👵"},
        new String[]{"Send a 'thinking of you' message to someone in your family", "💭"},
        new String[]{"Plan a small activity to do with family this week", "🎉"}
    );

    private static final List<String[]> GRATITUDE_CHALLENGES = List.of(
        new String[]{"Write down 3 things about your body you're grateful for", "🌟"},
        new String[]{"Thank someone directly for something they did, even something small", "🙏"},
        new String[]{"Find gratitude in something that's usually annoying", "🔄"},
        new String[]{"Write a gratitude letter you don't have to send", "✉️"},
        new String[]{"Notice 3 small things in your environment you're grateful for right now", "👀"}
    );

    @Override
    @Transactional
    public List<DailySurprise> getTodaysSurprises(Long userId) {
        LocalDate today = LocalDate.now();
        List<DailySurprise> existing = surpriseRepo.findByUserIdAndSurpriseDate(userId, today);
        if (!existing.isEmpty()) return existing;

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new SaathiException("User not found", HttpStatus.NOT_FOUND));

        int dayIdx = today.getDayOfYear();

        List<DailySurprise> surprises = new ArrayList<>();
        surprises.add(buildSurprise(user, DailySurprise.SurpriseType.WISDOM_CARD, "Today's Wisdom", pick(WISDOM_CARDS, dayIdx), today));
        surprises.add(buildSurprise(user, DailySurprise.SurpriseType.KINDNESS_MISSION, "Kindness Mission", pick(KINDNESS_MISSIONS, dayIdx), today));
        surprises.add(buildSurprise(user, DailySurprise.SurpriseType.REFLECTION_PROMPT, "Reflection Prompt", pick(REFLECTION_PROMPTS, dayIdx), today));
        surprises.add(buildSurprise(user, DailySurprise.SurpriseType.FAMILY_CHALLENGE, "Family Challenge", pick(FAMILY_CHALLENGES, dayIdx), today));
        surprises.add(buildSurprise(user, DailySurprise.SurpriseType.GRATITUDE_CHALLENGE, "Gratitude Challenge", pick(GRATITUDE_CHALLENGES, dayIdx), today));

        return surpriseRepo.saveAll(surprises);
    }

    private String[] pick(List<String[]> list, int dayIdx) {
        return list.get(dayIdx % list.size());
    }

    private DailySurprise buildSurprise(User user, DailySurprise.SurpriseType type, String title, String[] contentIcon, LocalDate today) {
        return DailySurprise.builder()
                .user(user).type(type).title(title)
                .content(contentIcon[0]).icon(contentIcon[1])
                .surpriseDate(today).build();
    }

    @Override
    @Transactional
    public DailySurprise openSurprise(Long userId, Long surpriseId) {
        DailySurprise surprise = getOwned(userId, surpriseId);
        if (!surprise.isOpened()) {
            surprise.setOpened(true);
            gamificationService.awardXP(userId, 5, "Opened daily surprise");
        }
        return surpriseRepo.save(surprise);
    }

    @Override
    @Transactional
    public DailySurprise completeSurprise(Long userId, Long surpriseId) {
        DailySurprise surprise = getOwned(userId, surpriseId);
        if (!surprise.isCompleted()) {
            surprise.setCompleted(true);
            surprise.setOpened(true);
            gamificationService.awardXP(userId, 15, "Completed daily surprise: " + surprise.getType());
        }
        return surpriseRepo.save(surprise);
    }

    private DailySurprise getOwned(Long userId, Long surpriseId) {
        DailySurprise surprise = surpriseRepo.findById(surpriseId)
                .orElseThrow(() -> new SaathiException("Surprise not found", HttpStatus.NOT_FOUND));
        if (!surprise.getUser().getId().equals(userId))
            throw new SaathiException("Not authorized", HttpStatus.FORBIDDEN);
        return surprise;
    }
}