package com.saathi.service.impl;

import com.saathi.entity.*;
import com.saathi.exception.SaathiException;
import com.saathi.repository.*;
import com.saathi.service.GamificationService;
import com.saathi.service.ShortsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ShortsServiceImpl implements ShortsService {

    private final SaathiShortRepository shortRepo;
    private final ShortViewRepository viewRepo;
    private final UserRepository userRepository;
    private final GamificationService gamificationService;

    private static final int DAILY_LIMIT = 5;

    // Seed content — curated shorts across all categories
    private static final List<Object[]> SEED_SHORTS = List.of(
        // [title, content, category, icon, color]
        new Object[]{"The Pomodoro Secret", "Studies show 25-minute focused bursts followed by 5-minute breaks improve retention by up to 30%. Your brain consolidates memory during breaks — don't skip them!", "STUDY_TIP", "📚", "#0ea5e9"},
        new Object[]{"Active Recall > Re-reading", "Testing yourself on material is 2x more effective than re-reading notes. Close the book and try to recall — that struggle is where learning happens.", "STUDY_TIP", "🧠", "#7c3aed"},
        new Object[]{"The 2-Minute Rule", "If a task takes less than 2 minutes, do it now instead of adding it to your list. Small actions compound into massive productivity over time.", "LIFE_LESSON", "⏱️", "#10b981"},
        new Object[]{"Comparison is the Thief of Joy", "Someone else's highlight reel is not your behind-the-scenes. Your journey, your pace, your story — that's what matters.", "EMOTIONAL_WELLBEING", "🌱", "#ec4899"},
        new Object[]{"The 5-Second Rule", "When you feel the urge to do something positive — count 5-4-3-2-1 and physically move. This interrupts hesitation before your brain can talk you out of it.", "LIFE_LESSON", "⚡", "#f59e0b"},
        new Object[]{"Network Before You Need It", "The best time to build professional relationships is before you need a favor. Stay in touch, share wins, offer help — relationships compound like interest.", "CAREER_ADVICE", "🤝", "#0ea5e9"},
        new Object[]{"Listen to Understand", "Most arguments happen because people listen to respond, not to understand. Next conversation, try fully understanding before replying. It changes everything.", "FAMILY_RELATIONSHIP", "👂", "#ef4444"},
        new Object[]{"Your Feelings Are Data, Not Directives", "Feeling anxious doesn't mean something is wrong — it's information. Pause, name the feeling, and then decide your next step. Emotions inform; they don't have to command.", "EMOTIONAL_WELLBEING", "💭", "#8b5cf6"},
        new Object[]{"The Feynman Technique", "To truly learn something, explain it in simple terms as if teaching a child. Gaps in your explanation reveal gaps in your understanding.", "STUDY_TIP", "🎓", "#10b981"},
        new Object[]{"Small Talk Builds Big Bridges", "That 'How was your day?' to a parent or sibling isn't trivial — it's relationship maintenance. Small consistent gestures build deep trust over time.", "FAMILY_RELATIONSHIP", "💬", "#f97316"},
        new Object[]{"Your Resume Tells a Story", "Don't just list duties — show impact. 'Increased X by Y%' beats 'Responsible for X' every time. Numbers tell stories recruiters remember.", "CAREER_ADVICE", "📈", "#0ea5e9"},
        new Object[]{"Discomfort is Often Growth", "If something feels uncomfortable but not unsafe, that discomfort might be exactly where you're meant to grow. Lean in gently.", "LIFE_LESSON", "🌿", "#84cc16"},
        new Object[]{"The Two-List Trick", "Write your to-do list, then make a 'won't-do' list. Saying no to distractions is as important as saying yes to priorities.", "STUDY_TIP", "✅", "#7c3aed"},
        new Object[]{"You Are Not Behind", "There is no universal timeline for life. The person who 'should be' further along by now is a myth. You're exactly where your journey has led you — and that's valid.", "EMOTIONAL_WELLBEING", "🕊️", "#a78bfa"},
        new Object[]{"Ask for Help Early", "Asking for help isn't weakness — it's efficiency. The earlier you ask, the more options you have. Waiting until crisis limits your choices.", "LIFE_LESSON", "🙋", "#0ea5e9"},
        new Object[]{"The Power of 'And'", "Instead of 'I'm tired, but I'll push through' try 'I'm tired, AND I can rest and still make progress tomorrow.' 'And' holds space for complexity without judgment.", "EMOTIONAL_WELLBEING", "🌈", "#ec4899"},
        new Object[]{"Informational Interviews Work", "Reach out to people in roles you're curious about and ask for 20 minutes to learn about their path. Most people say yes — and it could change your career trajectory.", "CAREER_ADVICE", "☕", "#f59e0b"},
        new Object[]{"Forgive Yourself for Past Choices", "You made the best decision you could with the information and emotional capacity you had then. Growth means doing better now — not punishing past-you forever.", "EMOTIONAL_WELLBEING", "💜", "#8b5cf6"},
        new Object[]{"The 80/20 of Studying", "80% of exam content often comes from 20% of the material — usually emphasized in lectures or repeated themes. Identify patterns; don't treat everything equally.", "STUDY_TIP", "🎯", "#10b981"},
        new Object[]{"Presence Beats Presents", "The people who love you remember the time you spent with them, not the things you gave them. Put the phone down for 10 minutes today — it matters more than you think.", "FAMILY_RELATIONSHIP", "❤️", "#ef4444"}
    );

    @Override
    public List<Map<String, Object>> getDailyShorts(Long userId) {
        if (shortRepo.count() == 0) seedShorts();

        List<SaathiShort> all = shortRepo.findAllByOrderByDisplayOrderAsc();
        long viewedToday = viewRepo.countByUserIdAndViewDate(userId, LocalDate.now());

        // Rotate based on day-of-year so each day shows different shorts
        int dayOfYear = LocalDate.now().getDayOfYear();
        int total = all.size();

        List<Map<String, Object>> result = new ArrayList<>();
        List<ShortView> todayViews = viewRepo.findByUserIdAndViewDate(userId, LocalDate.now());
        Map<Long, ShortView> viewMap = new HashMap<>();
        todayViews.forEach(v -> viewMap.put(v.getSaathiShort().getId(), v));

        for (int i = 0; i < DAILY_LIMIT && i < total; i++) {
            SaathiShort s = all.get((dayOfYear * DAILY_LIMIT + i) % total);
            Map<String, Object> item = new HashMap<>();
            item.put("short", s);
            ShortView v = viewMap.get(s.getId());
            item.put("viewed", v != null);
            item.put("liked", v != null && v.isLiked());
            item.put("saved", v != null && v.isSaved());
            result.add(item);
        }

        return result;
    }

    private void seedShorts() {
        List<SaathiShort> shorts = new ArrayList<>();
        for (int i = 0; i < SEED_SHORTS.size(); i++) {
            Object[] s = SEED_SHORTS.get(i);
            shorts.add(SaathiShort.builder()
                .title((String) s[0]).content((String) s[1])
                .category(SaathiShort.ShortCategory.valueOf((String) s[2]))
                .icon((String) s[3]).colorTheme((String) s[4])
                .displayOrder(i).build());
        }
        shortRepo.saveAll(shorts);
    }

    @Override
    public ShortView markViewed(Long userId, Long shortId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new SaathiException("User not found", HttpStatus.NOT_FOUND));
        SaathiShort s = shortRepo.findById(shortId)
                .orElseThrow(() -> new SaathiException("Short not found", HttpStatus.NOT_FOUND));

        Optional<ShortView> existing = viewRepo.findByUserIdAndSaathiShortIdAndViewDate(userId, shortId, LocalDate.now());
        if (existing.isPresent()) return existing.get();

        ShortView view = viewRepo.save(ShortView.builder()
                .user(user).saathiShort(s).viewDate(LocalDate.now()).build());

        gamificationService.awardXP(userId, 3, "Viewed SAATHI Short");
        return view;
    }

    @Override
    public ShortView toggleLike(Long userId, Long shortId) {
        ShortView view = getOrCreateView(userId, shortId);
        view.setLiked(!view.isLiked());
        return viewRepo.save(view);
    }

    @Override
    public ShortView toggleSave(Long userId, Long shortId) {
        ShortView view = getOrCreateView(userId, shortId);
        view.setSaved(!view.isSaved());
        return viewRepo.save(view);
    }

    private ShortView getOrCreateView(Long userId, Long shortId) {
        return viewRepo.findByUserIdAndSaathiShortIdAndViewDate(userId, shortId, LocalDate.now())
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new SaathiException("User not found", HttpStatus.NOT_FOUND));
                    SaathiShort s = shortRepo.findById(shortId)
                            .orElseThrow(() -> new SaathiException("Short not found", HttpStatus.NOT_FOUND));
                    return viewRepo.save(ShortView.builder()
                            .user(user).saathiShort(s).viewDate(LocalDate.now()).build());
                });
    }

    @Override
    public List<SaathiShort> getSaved(Long userId) {
        return viewRepo.findByUserIdAndSavedTrue(userId).stream()
                .map(ShortView::getSaathiShort).distinct().toList();
    }

    @Override
    public Map<String, Object> getStats(Long userId) {
        long viewedToday = viewRepo.countByUserIdAndViewDate(userId, LocalDate.now());
        long savedCount = viewRepo.findByUserIdAndSavedTrue(userId).size();

        Map<String, Object> stats = new HashMap<>();
        stats.put("viewedToday", viewedToday);
        stats.put("dailyLimit", DAILY_LIMIT);
        stats.put("savedCount", savedCount);
        stats.put("remainingToday", Math.max(0, DAILY_LIMIT - viewedToday));
        return stats;
    }
}
