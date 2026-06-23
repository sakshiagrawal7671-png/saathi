package com.saathi.service.impl;

import com.saathi.entity.*;
import com.saathi.exception.SaathiException;
import com.saathi.repository.*;
import com.saathi.service.PersonalityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class PersonalityServiceImpl implements PersonalityService {

    private final PersonalityAssessmentRepository assessmentRepo;
    private final PersonalityQuestionRepository questionRepo;
    private final UserRepository userRepository;

    // 50 Big Five questions seeded in-memory (5 traits × 10 questions each)
    private static final List<Object[]> QUESTIONS = List.of(
        // OPENNESS (O) — curious, creative, open to experience
        new Object[]{"I enjoy exploring new ideas and concepts.", "OPENNESS", false, 1},
        new Object[]{"I have a vivid imagination.", "OPENNESS", false, 2},
        new Object[]{"I enjoy art, music, or creative expression.", "OPENNESS", false, 3},
        new Object[]{"I am curious about many different things.", "OPENNESS", false, 4},
        new Object[]{"I enjoy thinking about abstract concepts.", "OPENNESS", false, 5},
        new Object[]{"I prefer routine over new experiences.", "OPENNESS", true, 6},
        new Object[]{"I find philosophical discussions interesting.", "OPENNESS", false, 7},
        new Object[]{"I enjoy visiting new places.", "OPENNESS", false, 8},
        new Object[]{"I am not interested in the arts.", "OPENNESS", true, 9},
        new Object[]{"I like to think of new ways of doing things.", "OPENNESS", false, 10},
        // CONSCIENTIOUSNESS (C) — organized, disciplined, dependable
        new Object[]{"I complete tasks on time.", "CONSCIENTIOUSNESS", false, 11},
        new Object[]{"I keep my belongings neat and organized.", "CONSCIENTIOUSNESS", false, 12},
        new Object[]{"I follow a schedule and stick to it.", "CONSCIENTIOUSNESS", false, 13},
        new Object[]{"I am very careful and thorough in my work.", "CONSCIENTIOUSNESS", false, 14},
        new Object[]{"I pay attention to details.", "CONSCIENTIOUSNESS", false, 15},
        new Object[]{"I often leave tasks unfinished.", "CONSCIENTIOUSNESS", true, 16},
        new Object[]{"I find it hard to get started on tasks.", "CONSCIENTIOUSNESS", true, 17},
        new Object[]{"I waste my time.", "CONSCIENTIOUSNESS", true, 18},
        new Object[]{"I do more than expected of me.", "CONSCIENTIOUSNESS", false, 19},
        new Object[]{"I am reliable and can be counted on.", "CONSCIENTIOUSNESS", false, 20},
        // EXTRAVERSION (E) — sociable, assertive, energetic
        new Object[]{"I feel comfortable around people.", "EXTRAVERSION", false, 21},
        new Object[]{"I enjoy social gatherings and parties.", "EXTRAVERSION", false, 22},
        new Object[]{"I start conversations easily.", "EXTRAVERSION", false, 23},
        new Object[]{"I feel energized being around others.", "EXTRAVERSION", false, 24},
        new Object[]{"I enjoy being the center of attention.", "EXTRAVERSION", false, 25},
        new Object[]{"I prefer staying home rather than going out.", "EXTRAVERSION", true, 26},
        new Object[]{"I find social situations draining.", "EXTRAVERSION", true, 27},
        new Object[]{"I am quiet around strangers.", "EXTRAVERSION", true, 28},
        new Object[]{"I make friends easily.", "EXTRAVERSION", false, 29},
        new Object[]{"I talk a lot.", "EXTRAVERSION", false, 30},
        // AGREEABLENESS (A) — compassionate, cooperative, trusting
        new Object[]{"I feel concern for others' wellbeing.", "AGREEABLENESS", false, 31},
        new Object[]{"I make people feel at ease.", "AGREEABLENESS", false, 32},
        new Object[]{"I am considerate and kind to almost everyone.", "AGREEABLENESS", false, 33},
        new Object[]{"I like to cooperate with others.", "AGREEABLENESS", false, 34},
        new Object[]{"I sympathize with others' feelings.", "AGREEABLENESS", false, 35},
        new Object[]{"I sometimes feel superior to others.", "AGREEABLENESS", true, 36},
        new Object[]{"I am not interested in others' problems.", "AGREEABLENESS", true, 37},
        new Object[]{"I insult people.", "AGREEABLENESS", true, 38},
        new Object[]{"I trust that people have good intentions.", "AGREEABLENESS", false, 39},
        new Object[]{"I enjoy helping others.", "AGREEABLENESS", false, 40},
        // NEUROTICISM (N) — emotional instability, anxiety, stress
        new Object[]{"I get stressed out easily.", "NEUROTICISM", false, 41},
        new Object[]{"I worry about things often.", "NEUROTICISM", false, 42},
        new Object[]{"I get upset easily.", "NEUROTICISM", false, 43},
        new Object[]{"I experience mood swings.", "NEUROTICISM", false, 44},
        new Object[]{"I often feel anxious.", "NEUROTICISM", false, 45},
        new Object[]{"I remain calm under pressure.", "NEUROTICISM", true, 46},
        new Object[]{"I rarely feel sad or depressed.", "NEUROTICISM", true, 47},
        new Object[]{"I handle stress well.", "NEUROTICISM", true, 48},
        new Object[]{"I feel at ease most of the time.", "NEUROTICISM", true, 49},
        new Object[]{"I seldom feel blue.", "NEUROTICISM", true, 50}
    );

    @Override
    public List<PersonalityQuestion> getQuestions() {
        // Seed questions if not present
        if (questionRepo.count() == 0) seedQuestions();
        return questionRepo.findAllByOrderByOrderIndexAsc();
    }

    private void seedQuestions() {
        List<PersonalityQuestion> questions = new ArrayList<>();
        for (Object[] q : QUESTIONS) {
            questions.add(PersonalityQuestion.builder()
                .questionText((String) q[0])
                .trait(PersonalityQuestion.BigFiveTrait.valueOf((String) q[1]))
                .reversed((boolean) q[2])
                .orderIndex((int) q[3])
                .build());
        }
        questionRepo.saveAll(questions);
    }

    @Override
    public PersonalityAssessment submitAssessment(Long userId, Map<Long, Integer> answers) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new SaathiException("User not found", HttpStatus.NOT_FOUND));

        List<PersonalityQuestion> questions = getQuestions();

        // Calculate trait scores
        Map<PersonalityQuestion.BigFiveTrait, List<Integer>> traitScores = new EnumMap<>(PersonalityQuestion.BigFiveTrait.class);
        for (PersonalityQuestion.BigFiveTrait t : PersonalityQuestion.BigFiveTrait.values())
            traitScores.put(t, new ArrayList<>());

        for (PersonalityQuestion q : questions) {
            Integer raw = answers.get(q.getId());
            if (raw == null) continue;
            int score = q.isReversed() ? (6 - raw) : raw; // 1-5 scale, reversed = 5-(val-1)
            traitScores.get(q.getTrait()).add(score);
        }

        int O = calcScore(traitScores.get(PersonalityQuestion.BigFiveTrait.OPENNESS));
        int C = calcScore(traitScores.get(PersonalityQuestion.BigFiveTrait.CONSCIENTIOUSNESS));
        int E = calcScore(traitScores.get(PersonalityQuestion.BigFiveTrait.EXTRAVERSION));
        int A = calcScore(traitScores.get(PersonalityQuestion.BigFiveTrait.AGREEABLENESS));
        int N = calcScore(traitScores.get(PersonalityQuestion.BigFiveTrait.NEUROTICISM));

        // Derive type name
        String type = deriveType(O, C, E, A, N);
        String summary = deriveSummary(O, C, E, A, N, type);
        String strengths = deriveStrengths(O, C, E, A, N);
        String growth = deriveGrowth(O, C, E, A, N);
        String careers = deriveCareerMatches(O, C, E, A, N);
        String relStyle = deriveRelationshipStyle(E, A, N);

        PersonalityAssessment pa = assessmentRepo.findByUserId(userId)
                .orElseGet(() -> PersonalityAssessment.builder().user(user).build());

        pa.setOpennessScore(O); pa.setOpennessLabel(label(O, "Openness"));
        pa.setConscientiousnessScore(C); pa.setConscientiousnessLabel(label(C, "Conscientiousness"));
        pa.setExtraversionScore(E); pa.setExtraversionLabel(label(E, "Extraversion"));
        pa.setAgreeablenessScore(A); pa.setAgreeablenessLabel(label(A, "Agreeableness"));
        pa.setNeuroticismScore(N); pa.setNeuroticismLabel(label(N, "Neuroticism"));
        pa.setPersonalityType(type);
        pa.setPersonalitySummary(summary);
        pa.setStrengths(strengths);
        pa.setGrowthAreas(growth);
        pa.setCareerMatches(careers);
        pa.setRelationshipStyle(relStyle);
        pa.setCompleted(true);
        pa.setCompletedAt(LocalDateTime.now());

        return assessmentRepo.save(pa);
    }

    private int calcScore(List<Integer> scores) {
        if (scores.isEmpty()) return 50;
        double avg = scores.stream().mapToInt(i -> i).average().orElse(3.0);
        return (int) Math.round((avg - 1) / 4.0 * 100); // convert 1-5 → 0-100
    }

    private String label(int score, String trait) {
        if (score >= 70) return "High " + trait;
        if (score >= 40) return "Moderate " + trait;
        return "Low " + trait;
    }

    private String deriveType(int O, int C, int E, int A, int N) {
        if (O > 70 && E > 60) return "The Visionary";
        if (O > 70 && C > 60) return "The Architect";
        if (C > 70 && A > 60) return "The Protector";
        if (E > 70 && A > 60) return "The Connector";
        if (A > 70 && N < 40) return "The Nurturer";
        if (O > 60 && A > 60) return "The Dreamer";
        if (C > 70 && E < 40) return "The Craftsperson";
        if (E > 70 && O > 50) return "The Explorer";
        if (N < 30 && C > 60) return "The Pillar";
        return "The Individual";
    }

    private String deriveSummary(int O, int C, int E, int A, int N, String type) {
        return String.format(
            "You are %s. Your personality is shaped by %s openness to experience, %s conscientiousness, " +
            "%s extraversion, %s agreeableness, and %s emotional sensitivity. " +
            "You bring unique strengths that can create real impact in the world.",
            type,
            O > 60 ? "high" : O > 40 ? "moderate" : "low",
            C > 60 ? "strong" : C > 40 ? "moderate" : "developing",
            E > 60 ? "vibrant" : E > 40 ? "balanced" : "reflective",
            A > 60 ? "deep" : A > 40 ? "balanced" : "independent",
            N > 60 ? "heightened" : N > 40 ? "moderate" : "steady"
        );
    }

    private String deriveStrengths(int O, int C, int E, int A, int N) {
        List<String> s = new ArrayList<>();
        if (O > 60) s.add("Creative thinking and innovation");
        if (O > 70) s.add("Ability to see connections others miss");
        if (C > 60) s.add("Reliability and follow-through");
        if (C > 70) s.add("Exceptional attention to detail");
        if (E > 60) s.add("Natural ability to inspire and energize others");
        if (E > 70) s.add("Strong networking and communication skills");
        if (A > 60) s.add("Empathy and emotional intelligence");
        if (A > 70) s.add("Conflict resolution and team harmony");
        if (N < 40) s.add("Emotional resilience under pressure");
        if (N < 30) s.add("Exceptional calm in difficult situations");
        if (s.isEmpty()) s.add("Balanced perspective across all domains");
        return String.join(", ", s);
    }

    private String deriveGrowth(int O, int C, int E, int A, int N) {
        List<String> g = new ArrayList<>();
        if (O < 40) g.add("Exploring new experiences and perspectives");
        if (C < 40) g.add("Building structured habits and routines");
        if (E < 40) g.add("Practising social confidence gradually");
        if (A < 40) g.add("Developing empathy and active listening");
        if (N > 60) g.add("Stress management and emotional regulation");
        if (N > 70) g.add("Building resilience through mindfulness practices");
        if (g.isEmpty()) g.add("Maintaining your well-balanced approach");
        return String.join(", ", g);
    }

    private String deriveCareerMatches(int O, int C, int E, int A, int N) {
        List<String> c = new ArrayList<>();
        if (O > 60 && E > 50) c.addAll(List.of("Entrepreneur", "Creative Director", "Product Designer"));
        if (O > 60 && C > 50) c.addAll(List.of("Researcher", "Software Engineer", "Data Scientist"));
        if (C > 60 && A > 50) c.addAll(List.of("Doctor", "Teacher", "Social Worker"));
        if (E > 60 && A > 50) c.addAll(List.of("HR Manager", "Counselor", "Sales Leader"));
        if (O > 50 && A > 60) c.addAll(List.of("Psychologist", "Writer", "UX Designer"));
        if (C > 70) c.addAll(List.of("Accountant", "Project Manager", "Engineer"));
        if (c.isEmpty()) c.addAll(List.of("Consultant", "Manager", "Analyst"));
        // deduplicate and take top 6
        return String.join(", ", c.stream().distinct().limit(6).toList());
    }

    private String deriveRelationshipStyle(int E, int A, int N) {
        if (E > 60 && A > 60) return "Warm and expressive — you build deep connections naturally and love supporting people.";
        if (E < 40 && A > 60) return "Quietly caring — you show love through actions, not words, and are deeply loyal.";
        if (E > 60 && A < 40) return "Charismatic and independent — you connect easily but value your personal freedom.";
        if (N > 60) return "Deeply feeling — you care intensely and may need reassurance; your sensitivity is a gift.";
        return "Balanced and steady — you are consistent, reliable, and approach relationships with maturity.";
    }

    @Override
    public PersonalityAssessment getResult(Long userId) {
        return assessmentRepo.findByUserId(userId).orElse(null);
    }

    @Override
    public boolean hasCompleted(Long userId) {
        return assessmentRepo.existsByUserId(userId) &&
               assessmentRepo.findByUserId(userId).map(PersonalityAssessment::isCompleted).orElse(false);
    }
}
