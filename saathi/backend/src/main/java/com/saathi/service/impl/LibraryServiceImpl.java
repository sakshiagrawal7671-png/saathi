package com.saathi.service.impl;

import com.saathi.entity.*;
import com.saathi.exception.SaathiException;
import com.saathi.repository.*;
import com.saathi.service.GamificationService;
import com.saathi.service.LibraryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class LibraryServiceImpl implements LibraryService {

    private final LibraryArticleRepository articleRepo;
    private final ArticleInteractionRepository interactionRepo;
    private final UserRepository userRepository;
    private final GamificationService gamificationService;

    // Seed content: title, summary, content, libraryType, theme, icon, color, readMinutes
    private static final List<Object[]> SEED_ARTICLES = List.of(
        // === LIFE LIBRARY ===
        new Object[]{"The Courage to Begin", "Every great journey starts with a single, imperfect step.",
            "Courage isn't the absence of fear — it's acting despite it. Research in psychology shows that people who take action while afraid build resilience faster than those who wait for fear to disappear. The most courageous people aren't fearless; they've simply learned that waiting for confidence often means waiting forever. Today, identify one thing you've been postponing out of fear. Take one small step toward it — not the whole leap, just one step. Courage compounds, just like habits.",
            "LIFE", "COURAGE", "🦁", "#ef4444", 4},
        new Object[]{"Why Hope Isn't Naive", "Hope is a skill, not a feeling — and it can be learned.",
            "Psychologist C.R. Snyder's research found that 'hope' is composed of three things: goals, pathways (multiple ways to reach them), and agency (belief you can pursue those pathways). People with high hope don't just wish for good outcomes — they actively generate alternative routes when obstacles appear. This is learnable. Next time you face a setback, instead of asking 'why did this happen,' ask 'what's another way forward?' That shift — from despair to pathway-thinking — is the essence of hope.",
            "LIFE", "HOPE", "🌅", "#f59e0b", 5},
        new Object[]{"Compassion Starts With You", "You can't pour from an empty cup — self-compassion fuels compassion for others.",
            "Dr. Kristin Neff's research identifies three components of self-compassion: self-kindness (vs. self-judgment), common humanity (recognizing everyone struggles), and mindfulness (vs. over-identification with pain). People high in self-compassion are actually MORE motivated to improve — because they're not paralyzed by shame. Try this: next time you make a mistake, speak to yourself as you would to a dear friend going through the same thing. Notice the difference.",
            "LIFE", "COMPASSION", "💗", "#ec4899", 4},
        new Object[]{"The Patience Paradox", "Sometimes the fastest way forward is to slow down.",
            "In a famous study, the 'Stanford marshmallow experiment' linked a child's ability to delay gratification with long-term life outcomes. But patience isn't about suppression — it's about trust. Trusting the process, trusting timing, trusting that growth is happening even when it's invisible (like a seed underground). Next time you feel impatient, ask: 'Am I rushing because of genuine urgency, or because discomfort with uncertainty?' Often, it's the latter — and that's where patience becomes a practice.",
            "LIFE", "PATIENCE", "🌱", "#10b981", 4},
        new Object[]{"Gratitude Rewires Your Brain", "Neuroscience confirms: gratitude practice physically changes your brain.",
            "Studies using fMRI scans show that people who practice gratitude regularly show increased activity in the medial prefrontal cortex — an area associated with positive emotions and decision-making. The effect compounds: the more you practice gratitude, the more naturally your brain notices things to be grateful for. It's literally training your attention. Start small: name one thing, however tiny, that you're grateful for right now. Your brain is listening.",
            "LIFE", "GRATITUDE", "🙏", "#f59e0b", 3},
        new Object[]{"Finding Your 'Why'", "Purpose isn't found — it's built through action and reflection.",
            "Viktor Frankl, a Holocaust survivor and psychiatrist, found that those who survived the camps with their spirit intact often had a strong 'why' — something or someone to live for. He called this 'logotherapy.' But here's the key insight: purpose often emerges FROM action, not before it. You don't need to know your life's purpose to start; you discover it by trying things, noticing what energizes you, and following that thread. Purpose is a direction, not a destination.",
            "LIFE", "PURPOSE", "🧭", "#7c3aed", 5},
        new Object[]{"The Psychology of Habits", "Your brain doesn't care about goals — it cares about cues and rewards.",
            "Charles Duhigg's research on the 'habit loop' shows every habit has three parts: a cue (trigger), a routine (behavior), and a reward. To build a new habit, don't focus on willpower — redesign your environment. Want to read more? Put the book on your pillow. Want to journal? Keep it next to your toothbrush. Make the cue obvious and the routine easy. Your environment shapes your behavior far more than motivation does.",
            "LIFE", "PSYCHOLOGY", "🧠", "#0ea5e9", 5},
        new Object[]{"Why We Misread Others", "Most conflicts come from misunderstanding intent, not malice.",
            "The 'fundamental attribution error' is a cognitive bias where we attribute others' actions to their character ('they're rude') while attributing our own actions to circumstances ('I was stressed'). This double standard fuels countless conflicts. Next time someone's behavior frustrates you, try asking: 'What might be happening in their life that I can't see?' This single shift in perspective can defuse most interpersonal tension.",
            "LIFE", "HUMAN_BEHAVIOUR", "👥", "#8b5cf6", 4},
        new Object[]{"Naming Emotions Reduces Their Power", "'Name it to tame it' — a simple phrase backed by neuroscience.",
            "Dr. Dan Siegel's research shows that simply naming an emotion ('I feel anxious') activates the prefrontal cortex and calms the amygdala (the brain's alarm system). This is called 'affect labeling.' It doesn't make the feeling disappear, but it reduces its intensity and gives you more capacity to respond thoughtfully rather than react. Next time you feel overwhelmed, try silently naming the emotion: 'This is frustration. This is sadness.' Notice what happens.",
            "LIFE", "EMOTIONAL_INTELLIGENCE", "💭", "#ec4899", 3},
        new Object[]{"The Skill of Saying No", "Boundaries aren't walls — they're the doors that let the right things in.",
            "Many people fear that saying 'no' will damage relationships. Research suggests the opposite: people who set clear, kind boundaries are often respected MORE, not less. A boundary isn't rejection — it's communication about your capacity. Try this phrase: 'I can't do that right now, but I appreciate you thinking of me.' It's kind, clear, and honest — and it protects your energy for the things that matter most.",
            "LIFE", "LIFE_SKILLS", "🚧", "#0ea5e9", 4},
        new Object[]{"Growth Happens in Discomfort", "Comfort and growth cannot coexist in the same moment.",
            "The 'optimal anxiety zone' in psychology describes a sweet spot — not so comfortable you stagnate, not so anxious you freeze, but just uncomfortable enough to stretch. This is where learning happens fastest. If everything in your life feels easy, you may be in a growth plateau. If everything feels overwhelming, you may need to scale back. The goal is the edge — uncomfortable but survivable.",
            "LIFE", "PERSONAL_GROWTH", "📈", "#84cc16", 4},

        // === HOPE LIBRARY ===
        new Object[]{"After Failure Comes Wisdom", "J.K. Rowling was rejected by 12 publishers before Harry Potter found a home.",
            "Before becoming one of the best-selling authors in history, J.K. Rowling was a single mother on welfare, rejected repeatedly. She has spoken about how that period of failure stripped away everything inessential — and in doing so, freed her to focus on what mattered. Failure isn't the opposite of success; it's often the foundation of it. If you're facing failure right now, you're not at the end of your story — you might be at its most important chapter.",
            "HOPE", "OVERCOMING_FAILURE", "📖", "#f59e0b", 4},
        new Object[]{"Grief Doesn't Follow a Schedule", "Loss reshapes us — but it doesn't have to define us forever.",
            "Grief researchers have moved away from the idea of 'stages' that happen in order, recognizing instead that grief is non-linear — waves that come and go, sometimes years later. This is normal. There's no 'getting over it' — there's learning to carry it differently. If you're grieving, be patient with yourself. The fact that grief still visits you means love was real. That's not weakness — that's evidence of how deeply you loved.",
            "HOPE", "OVERCOMING_LOSS", "🕊️", "#8b5cf6", 5},
        new Object[]{"The Comeback Stories We Don't See", "Most people who 'made it' had a chapter they don't talk about.",
            "Oprah Winfrey was fired from her first TV job and told she was 'unfit for television.' Steve Jobs was fired from the company he founded. Walt Disney went bankrupt multiple times. These aren't anomalies — they're patterns. Adversity isn't a sign you're on the wrong path; it's often a sign you're attempting something worth attempting. The people we admire most usually have the most interesting 'failure' stories — we just don't hear about those parts.",
            "HOPE", "OVERCOMING_ADVERSITY", "🔥", "#ef4444", 4},
        new Object[]{"Rejection Is Redirection", "Every 'no' that closes a door often opens one you couldn't see yet.",
            "Studies on career trajectories show that many people's most meaningful work came after a rejection redirected them. The job you didn't get might have led you somewhere better. The relationship that ended might have made room for one that fits. This doesn't make rejection painless — but it can make it less final. Rejection closes one door while you're standing in a hallway full of doors you haven't noticed yet.",
            "HOPE", "OVERCOMING_REJECTION", "🚪", "#0ea5e9", 4},
        new Object[]{"Resilience Is Built, Not Born", "You are not naturally resilient or not — resilience is a muscle.",
            "The American Psychological Association defines resilience as the process of adapting well in the face of adversity — and crucially, it's a SET OF BEHAVIORS, not a fixed trait. Connection with others, maintaining routines, taking care of your body, and finding meaning in struggle — these all build resilience over time. If you don't feel resilient right now, that's not a verdict on your character. It means you're in the building phase. Keep going.",
            "HOPE", "RESILIENCE", "💪", "#10b981", 5},
        new Object[]{"The Light at the End is Real", "Even in the darkest seasons, change is constant — including yours.",
            "Nothing in nature stays the same forever — not weather, not seasons, not the body's chemistry. The brain that feels hopeless today is chemically and structurally different from the brain you'll have in 6 months, especially with support, time, and small consistent care. If you're in a dark season, you don't have to believe things will get better — you just have to not give up on finding out. Stay. Reach out. The story isn't finished.",
            "HOPE", "HOPE", "🌟", "#f59e0b", 3},
        new Object[]{"You're Allowed to Start Over", "There's no rule that says you can't begin again — at any age.",
            "Vera Wang was a competitive figure skater before becoming a fashion icon at 40. Colonel Sanders started KFC at 65. Society often implies there's a 'right time' for major life changes, but biology and history disagree. Your timeline is yours. Starting over isn't a sign of failure — it's a sign you're still listening to yourself, still growing, still alive to possibility.",
            "HOPE", "PERSONAL_GROWTH", "🔄", "#7c3aed", 4},
        new Object[]{"The Strength in Asking for Help", "Reaching out isn't giving up — it's often the bravest move there is.",
            "There's a myth that strong people handle everything alone. In reality, every major achievement in human history involved teams, mentors, and support systems. Asking for help is not a deduction from your strength — it's a multiplier. If you're struggling and haven't reached out yet, consider this your permission. The people who care about you would rather know than wonder.",
            "HOPE", "RESILIENCE", "🤝", "#10b981", 3},
        new Object[]{"Small Wins Count", "Recovery and growth aren't about giant leaps — they're built from tiny, repeated wins.",
            "Behavioral scientists call this the 'progress principle' — even small wins create disproportionate boosts in motivation and mood. Got out of bed today? Win. Drank water? Win. Reached out to one person? Win. These aren't 'just' small things — they're the building blocks of momentum. On hard days, redefine what counts as a win. Survival is productivity too.",
            "HOPE", "OVERCOMING_ADVERSITY", "✨", "#f59e0b", 3},
        new Object[]{"You Are Not Your Worst Day", "A single bad moment, week, or even year doesn't define your whole story.",
            "Cognitive distortions often make us believe that 'this is how it will always be.' But humans are remarkably capable of change — the brain remains plastic (able to rewire) throughout life. The person you are during your hardest moments is not a permanent identity — it's a temporary state. With time, support, and small steps, the story continues — and it can include chapters you can't yet imagine.",
            "HOPE", "HOPE", "🌈", "#ec4899", 4}
    );

    @Override
    public List<LibraryArticle> getArticles(LibraryArticle.LibraryType type, String theme) {
        if (articleRepo.count() == 0) seedArticles();
        if (theme != null && !theme.isBlank()) {
            return articleRepo.findByLibraryTypeAndThemeAndPublishedTrueOrderByDisplayOrderAsc(
                    type, LibraryArticle.LibraryTheme.valueOf(theme));
        }
        return articleRepo.findByLibraryTypeAndPublishedTrueOrderByDisplayOrderAsc(type);
    }

    private void seedArticles() {
        List<LibraryArticle> articles = new ArrayList<>();
        for (int i = 0; i < SEED_ARTICLES.size(); i++) {
            Object[] a = SEED_ARTICLES.get(i);
            articles.add(LibraryArticle.builder()
                .title((String) a[0]).summary((String) a[1]).content((String) a[2])
                .libraryType(LibraryArticle.LibraryType.valueOf((String) a[3]))
                .theme(LibraryArticle.LibraryTheme.valueOf((String) a[4]))
                .icon((String) a[5]).colorTheme((String) a[6])
                .readMinutes((int) a[7]).displayOrder(i).build());
        }
        articleRepo.saveAll(articles);
    }

    @Override
    public LibraryArticle getArticle(Long id) {
        if (articleRepo.count() == 0) seedArticles();
        return articleRepo.findById(id)
                .orElseThrow(() -> new SaathiException("Article not found", HttpStatus.NOT_FOUND));
    }

    @Override
    public ArticleInteraction markRead(Long userId, Long articleId) {
        ArticleInteraction interaction = getOrCreate(userId, articleId);
        if (!interaction.isRead()) {
            interaction.setRead(true);
            gamificationService.awardXP(userId, 5, "Read library article");
        }
        return interactionRepo.save(interaction);
    }

    @Override
    public ArticleInteraction toggleBookmark(Long userId, Long articleId) {
        ArticleInteraction interaction = getOrCreate(userId, articleId);
        interaction.setBookmarked(!interaction.isBookmarked());
        return interactionRepo.save(interaction);
    }

    @Override
    public ArticleInteraction markHelpful(Long userId, Long articleId) {
        ArticleInteraction interaction = getOrCreate(userId, articleId);
        interaction.setFoundHelpful(!interaction.isFoundHelpful());
        return interactionRepo.save(interaction);
    }

    private ArticleInteraction getOrCreate(Long userId, Long articleId) {
        return interactionRepo.findByUserIdAndArticleId(userId, articleId).orElseGet(() -> {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new SaathiException("User not found", HttpStatus.NOT_FOUND));
            LibraryArticle article = getArticle(articleId);
            return ArticleInteraction.builder().user(user).article(article).build();
        });
    }

    @Override
    public List<LibraryArticle> getBookmarked(Long userId, LibraryArticle.LibraryType type) {
        return interactionRepo.findByUserIdAndBookmarkedTrue(userId).stream()
                .map(ArticleInteraction::getArticle)
                .filter(a -> type == null || a.getLibraryType() == type)
                .distinct().toList();
    }

    @Override
    public Map<String, Object> getStats(Long userId) {
        Map<String, Object> stats = new HashMap<>();
        stats.put("articlesRead", interactionRepo.countByUserIdAndReadTrue(userId));
        stats.put("bookmarked", interactionRepo.findByUserIdAndBookmarkedTrue(userId).size());
        return stats;
    }
}
