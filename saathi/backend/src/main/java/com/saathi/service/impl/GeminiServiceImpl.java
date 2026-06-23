package com.saathi.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.saathi.entity.*;
import com.saathi.exception.SaathiException;
import com.saathi.repository.*;
import com.saathi.service.GeminiService;
import com.saathi.service.GamificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.*;

@Service @RequiredArgsConstructor @Slf4j
public class GeminiServiceImpl implements GeminiService {

    private final ChatMessageRepository chatRepo;
    private final UserRepository userRepository;
    private final MoodEntryRepository moodRepo;
    private final GoalRepository goalRepo;
    private final PersonalityAssessmentRepository personalityRepo;
    private final GratitudeEntryRepository gratitudeRepo;
    private final GamificationService gamificationService;
    private final ObjectMapper objectMapper;

    @Value("${saathi.ai.gemini.api-key:demo}") private String geminiApiKey;
    @Value("${saathi.ai.gemini.url:https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent}") private String geminiUrl;
    @Value("${saathi.ai.openai.api-key:demo}") private String openaiApiKey;
    @Value("${saathi.ai.openai.url:https://api.openai.com/v1/chat/completions}") private String openaiUrl;
    @Value("${saathi.ai.openai.model:gpt-3.5-turbo}") private String openaiModel;

    private static final String BASE_SYSTEM_PROMPT = """
        You are SAATHI, a deeply compassionate AI companion focused on human connection,
        emotional wellbeing, and life guidance. You speak warmly, listen deeply, never judge.
        You validate feelings, encourage growth, and gently guide toward connection with family
        and real-world relationships. If someone shows serious distress, encourage reaching out
        to a professional or trusted person. Keep responses warm, conversational, under 200 words.
        """;

    @Override
    public String getActiveProvider() {
        if (isReal(geminiApiKey)) return "GEMINI";
        if (isReal(openaiApiKey)) return "OPENAI";
        return "DEMO";
    }

    private boolean isReal(String key) {
        return key != null && !key.equals("demo") && !key.startsWith("YOUR_");
    }

    @Override
    public ChatMessage chat(Long userId, String message, String preferredProvider) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new SaathiException("User not found", HttpStatus.NOT_FOUND));

        ChatMessage userMsg = ChatMessage.builder().user(user)
                .role(ChatMessage.MessageRole.USER).content(message)
                .emotionTag(detectEmotion(message)).build();
        chatRepo.save(userMsg);

        String systemPrompt = buildContextualPrompt(userId, user);
        String provider = preferredProvider != null ? preferredProvider : getActiveProvider();
        String response;
        try {
            response = switch (provider) {
                case "GEMINI" -> callGemini(userId, message, systemPrompt);
                case "OPENAI" -> callOpenAI(userId, message, systemPrompt);
                default -> generateLocalResponse(message, user.getFullName());
            };
        } catch (Exception e) {
            log.warn("AI call failed ({}): {}", provider, e.getMessage());
            response = generateLocalResponse(message, user.getFullName());
        }

        ChatMessage aiMsg = ChatMessage.builder().user(user)
                .role(ChatMessage.MessageRole.ASSISTANT).content(response).build();
        chatRepo.save(aiMsg);
        gamificationService.awardXP(userId, 3, "SAATHI AI chat");
        return aiMsg;
    }

    private String buildContextualPrompt(Long userId, User user) {
        StringBuilder ctx = new StringBuilder(BASE_SYSTEM_PROMPT).append("\n\nUSER CONTEXT:\n");
        ctx.append("Name: ").append(user.getFullName()).append("\n");
        ctx.append("Level: ").append(user.getLevel()).append(" (XP: ").append(user.getXpPoints()).append(")\n");
        ctx.append("Streak: ").append(user.getStreakDays()).append(" days\n");
        moodRepo.findByUserIdOrderByEntryDateDesc(userId).stream().findFirst()
                .ifPresent(m -> ctx.append("Latest mood: ").append(m.getMood()).append(", stress ").append(m.getStressLevel()).append("/10\n"));
        personalityRepo.findByUserId(userId)
                .ifPresent(p -> ctx.append("Personality: ").append(p.getPersonalityType()).append("\n"));
        var goals = goalRepo.findByUserIdAndStatus(userId, Goal.GoalStatus.IN_PROGRESS);
        if (!goals.isEmpty())
            ctx.append("Active goals: ").append(goals.stream().map(Goal::getTitle).limit(3)
                    .reduce((a,b) -> a+", "+b).orElse("")).append("\n");
        return ctx.toString();
    }

    private String callGemini(Long userId, String message, String systemPrompt) throws Exception {
        RestTemplate rest = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        List<ChatMessage> history = chatRepo.findTop20ByUserIdOrderByCreatedAtDesc(userId);
        Collections.reverse(history);
        List<Map<String, Object>> contents = new ArrayList<>();
        for (ChatMessage h : history)
            contents.add(Map.of("role", h.getRole()==ChatMessage.MessageRole.USER?"user":"model",
                    "parts", List.of(Map.of("text", h.getContent()))));
        contents.add(Map.of("role", "user", "parts", List.of(Map.of("text", message))));

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("system_instruction", Map.of("parts", List.of(Map.of("text", systemPrompt))));
        body.put("contents", contents);
        body.put("generationConfig", Map.of("maxOutputTokens", 400, "temperature", 0.8));

        ResponseEntity<String> res = rest.postForEntity(geminiUrl + "?key=" + geminiApiKey,
                new HttpEntity<>(body, headers), String.class);
        return objectMapper.readTree(res.getBody()).path("candidates").get(0)
                .path("content").path("parts").get(0).path("text").asText();
    }

    private String callOpenAI(Long userId, String message, String systemPrompt) throws Exception {
        RestTemplate rest = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(openaiApiKey);

        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "system", "content", systemPrompt));
        List<ChatMessage> history = chatRepo.findTop20ByUserIdOrderByCreatedAtDesc(userId);
        Collections.reverse(history);
        history.stream().limit(10).forEach(m ->
                messages.add(Map.of("role", m.getRole().name().toLowerCase(), "content", m.getContent())));
        messages.add(Map.of("role", "user", "content", message));

        Map<String, Object> body = Map.of("model", openaiModel, "messages", messages, "max_tokens", 300, "temperature", 0.8);
        ResponseEntity<String> res = rest.postForEntity(openaiUrl, new HttpEntity<>(body, headers), String.class);
        return objectMapper.readTree(res.getBody()).path("choices").get(0).path("message").path("content").asText();
    }

    private String generateLocalResponse(String message, String userName) {
        String name = (userName != null && !userName.isBlank()) ? userName.split(" ")[0] : "friend";
        String lower = message.toLowerCase();
        if (lower.contains("sad") || lower.contains("cry"))
            return "I hear you, " + name + ". It takes courage to share this. Sadness is deeply human, and you don't have to carry it alone. What's weighing on your heart?";
        if (lower.contains("anxious") || lower.contains("stress") || lower.contains("overwhelm"))
            return "I can feel things seem heavy right now, " + name + ". Take one slow breath with me. You've navigated hard moments before. What feels most overwhelming?";
        if (lower.contains("happy") || lower.contains("great") || lower.contains("amazing"))
            return "That genuinely warms my heart, " + name + "! 🌟 Joy is worth celebrating. What's been bringing you this happiness? I'd love to hear more.";
        if (lower.contains("lonely") || lower.contains("alone"))
            return "Loneliness is one of the hardest feelings, " + name + ". And yet, you reached out — that matters. Is there someone you could connect with today, even briefly?";
        if (lower.contains("tired") || lower.contains("exhaust"))
            return "Rest is not laziness, " + name + " — it's a necessity. Your body and mind are asking for care. What's one thing you could let go of today?";
        if (lower.contains("goal") || lower.contains("dream"))
            return "Your goals say so much about who you're becoming, " + name + ". What's one small step you could take today toward what matters most to you?";
        return "Thank you for sharing that with me, " + name + ". I'm listening fully. Tell me more about what's on your mind and heart right now. 💜";
    }

    @Override
    public String analyzeWithContext(Long userId, String text, String analysisType) {
        if (text == null || text.isBlank()) return "No text to analyze.";
        String lower = text.toLowerCase();
        return switch (analysisType) {
            case "EMOTION" -> {
                if (lower.contains("happy") || lower.contains("grateful")) yield "Your writing carries a positive, hopeful tone.";
                if (lower.contains("sad") || lower.contains("hurt")) yield "Your writing reflects sadness. This is valid. Consider reaching out to someone you trust.";
                if (lower.contains("angry") || lower.contains("frustrated")) yield "Your writing shows frustration — an important signal worth exploring.";
                if (lower.contains("anxious") || lower.contains("worry")) yield "Your writing shows anxiety. Remember: you've navigated uncertainty before.";
                yield "Your writing reflects a neutral, thoughtful state — a good foundation for reflection.";
            }
            case "BURNOUT" -> {
                long signals = Arrays.stream(new String[]{"exhaust","burnout","can't anymore","done","tired","overwhelm"})
                        .filter(lower::contains).count();
                yield signals >= 3 ? "High burnout indicators. Please prioritise rest and consider speaking to someone."
                        : signals >= 1 ? "Some signs of stress. Take care of yourself today."
                        : "No significant burnout indicators. Keep maintaining your wellbeing practices.";
            }
            case "GROWTH" -> "Your reflection shows self-awareness and a desire to grow — key markers of emotional intelligence.";
            default -> "Analysis complete. Your writing reflects your current emotional state.";
        };
    }

    @Override
    public Map<String, Object> generatePersonalizedInsights(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new SaathiException("User not found", HttpStatus.NOT_FOUND));
        List<String> insights = new ArrayList<>();
        List<String> recommendations = new ArrayList<>();

        var moods = moodRepo.findByUserIdOrderByEntryDateDesc(userId);
        if (!moods.isEmpty()) {
            double avgStress = moods.stream().limit(7).mapToInt(MoodEntry::getStressLevel).average().orElse(0);
            insights.add(avgStress > 7 ? "Your stress has been elevated this week. Prioritise rest and breathe. 💜"
                    : avgStress < 4 ? "Your stress has been well-managed this week! Whatever you're doing — keep it up! 🌟"
                    : "Your stress levels are moderate — keep checking in with yourself.");
        }
        if (user.getStreakDays() >= 7) insights.add("7-day streak! Consistency is your superpower right now. ⚡");
        var goals = goalRepo.findByUserIdAndStatus(userId, Goal.GoalStatus.IN_PROGRESS);
        goals.stream().max(Comparator.comparingInt(Goal::getProgress)).filter(g -> g.getProgress() > 50)
                .ifPresent(g -> insights.add("You're more than halfway to '" + g.getTitle() + "'. Keep going! 🎯"));
        if (gratitudeRepo.findByUserIdOrderByCreatedAtDesc(userId).isEmpty())
            recommendations.add("Try adding your first gratitude entry today — it shifts your mood in 30 seconds.");
        recommendations.add("Consider reaching out to one person in your family or inner circle today.");
        recommendations.add("A 25-minute focus session can clear your mind and build momentum.");
        if (insights.isEmpty()) insights.add("You're doing well, " + user.getFullName().split(" ")[0] + ". Keep showing up for yourself. 💜");

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("insights", insights);
        result.put("recommendations", recommendations);
        result.put("provider", getActiveProvider());
        result.put("generatedAt", LocalDateTime.now().toString());
        return result;
    }

    private ChatMessage.EmotionTag detectEmotion(String text) {
        String l = text.toLowerCase();
        if (l.contains("happy") || l.contains("joy")) return ChatMessage.EmotionTag.HAPPY;
        if (l.contains("sad") || l.contains("cry")) return ChatMessage.EmotionTag.SAD;
        if (l.contains("anxious") || l.contains("worry")) return ChatMessage.EmotionTag.ANXIOUS;
        if (l.contains("angry")) return ChatMessage.EmotionTag.ANGRY;
        if (l.contains("stress")) return ChatMessage.EmotionTag.STRESSED;
        if (l.contains("hopeful") || l.contains("excited")) return ChatMessage.EmotionTag.HOPEFUL;
        if (l.contains("end it") || l.contains("don't want to live")) return ChatMessage.EmotionTag.CRISIS;
        return ChatMessage.EmotionTag.NEUTRAL;
    }
}
