package com.saathi.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.saathi.entity.ChatMessage;
import com.saathi.entity.User;
import com.saathi.exception.SaathiException;
import com.saathi.repository.ChatMessageRepository;
import com.saathi.repository.UserRepository;
import com.saathi.service.AiCompanionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiCompanionServiceImpl implements AiCompanionService {

    private final ChatMessageRepository chatRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    @Value("${saathi.ai.openai.api-key:demo}")
    private String apiKey;

    @Value("${saathi.ai.openai.url:https://api.openai.com/v1/chat/completions}")
    private String apiUrl;

    @Value("${saathi.ai.openai.model:gpt-3.5-turbo}")
    private String model;

    private static final String SYSTEM_PROMPT = """
            You are SAATHI, a compassionate AI companion focused on emotional wellbeing and life guidance.
            You listen deeply, validate feelings, and gently encourage growth.
            You never judge, shame, or compare. You speak with warmth, care, and wisdom.
            If someone shows signs of crisis, gently guide them to professional help and trusted people.
            Keep responses conversational, warm, and under 200 words unless more detail is needed.
            """;

    @Override
    public ChatMessage chat(Long userId, String userMessage) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new SaathiException("User not found", HttpStatus.NOT_FOUND));

        // Save user message
        ChatMessage userMsg = ChatMessage.builder()
                .user(user)
                .role(ChatMessage.MessageRole.USER)
                .content(userMessage)
                .emotionTag(detectEmotion(userMessage))
                .build();
        chatRepository.save(userMsg);

        // Get AI response
        String aiResponse = callOpenAI(userId, userMessage, user.getFullName());

        ChatMessage aiMsg = ChatMessage.builder()
                .user(user)
                .role(ChatMessage.MessageRole.ASSISTANT)
                .content(aiResponse)
                .build();
        chatRepository.save(aiMsg);

        return aiMsg;
    }

    private String callOpenAI(Long userId, String userMessage, String userName) {
        if ("demo".equals(apiKey) || apiKey.startsWith("YOUR_")) {
            return generateLocalResponse(userMessage, userName);
        }

        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            List<Map<String, String>> messages = new ArrayList<>();
            messages.add(Map.of("role", "system", "content", SYSTEM_PROMPT));

            // Add recent history
            List<ChatMessage> history = chatRepository.findTop20ByUserIdOrderByCreatedAtDesc(userId);
            Collections.reverse(history);
            history.stream().limit(10).forEach(m ->
                    messages.add(Map.of("role", m.getRole().name().toLowerCase(), "content", m.getContent()))
            );
            messages.add(Map.of("role", "user", "content", userMessage));

            Map<String, Object> body = Map.of(
                    "model", model,
                    "messages", messages,
                    "max_tokens", 300,
                    "temperature", 0.8
            );

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, entity, String.class);

            JsonNode root = objectMapper.readTree(response.getBody());
            return root.path("choices").get(0).path("message").path("content").asText();
        } catch (Exception e) {
            log.warn("OpenAI call failed, using local response: {}", e.getMessage());
            return generateLocalResponse(userMessage, userName);
        }
    }

    private String generateLocalResponse(String message, String userName) {
        String name = userName != null ? userName.split(" ")[0] : "friend";
        String lower = message.toLowerCase();

        if (lower.contains("sad") || lower.contains("cry") || lower.contains("upset"))
            return "I hear you, " + name + ". It takes courage to share how you're feeling. Sadness is a part of being human, and you don't have to face it alone. I'm right here with you. Would you like to talk more about what's going on?";
        if (lower.contains("anxious") || lower.contains("stress") || lower.contains("worry"))
            return "I can sense there's a lot on your mind right now, " + name + ". Anxiety can feel overwhelming, but remember — you've handled difficult moments before, and you're stronger than you realize. Take a slow breath with me. What's weighing on you most right now?";
        if (lower.contains("happy") || lower.contains("great") || lower.contains("good"))
            return "That genuinely warms my heart, " + name + "! It's so important to recognize and hold onto these good moments. What's been bringing you this joy? I'd love to hear more!";
        if (lower.contains("lonely") || lower.contains("alone"))
            return "Feeling lonely is one of the hardest human experiences, " + name + ". But reaching out — even here — is a beautiful act of courage. You matter to the people around you. Have you been able to connect with anyone today, even briefly?";
        if (lower.contains("family") || lower.contains("mom") || lower.contains("dad"))
            return "Family relationships hold so much meaning in our lives. Whether they bring us joy or challenges, they shape who we are. What's on your heart about your family right now, " + name + "?";
        if (lower.contains("goal") || lower.contains("dream") || lower.contains("future"))
            return "Your dreams and goals say so much about who you are and who you want to become, " + name + ". I believe in your ability to grow toward them. What's one small step you could take today toward what matters most to you?";

        return "Thank you for sharing that with me, " + name + ". I'm here, listening fully. You have my complete attention — tell me more about what's on your mind and heart.";
    }

    @Override
    public String analyzeText(String text) {
        return "Analysis: The text reflects emotional processing and self-reflection.";
    }

    @Override
    public List<ChatMessage> getChatHistory(Long userId) {
        return chatRepository.findByUserIdOrderByCreatedAtAsc(userId);
    }

    @Override
    public void clearHistory(Long userId) {
        List<ChatMessage> messages = chatRepository.findByUserIdOrderByCreatedAtAsc(userId);
        chatRepository.deleteAll(messages);
    }

    private ChatMessage.EmotionTag detectEmotion(String text) {
        String lower = text.toLowerCase();
        if (lower.contains("happy") || lower.contains("joy")) return ChatMessage.EmotionTag.HAPPY;
        if (lower.contains("sad") || lower.contains("cry")) return ChatMessage.EmotionTag.SAD;
        if (lower.contains("anxious") || lower.contains("worry")) return ChatMessage.EmotionTag.ANXIOUS;
        if (lower.contains("angry") || lower.contains("furious")) return ChatMessage.EmotionTag.ANGRY;
        if (lower.contains("stress")) return ChatMessage.EmotionTag.STRESSED;
        if (lower.contains("hopeful") || lower.contains("excited")) return ChatMessage.EmotionTag.HOPEFUL;
        if (lower.contains("end it") || lower.contains("don't want to live")) return ChatMessage.EmotionTag.CRISIS;
        return ChatMessage.EmotionTag.NEUTRAL;
    }
}
