package com.saathi.service;
import com.saathi.entity.ChatMessage;
import java.util.Map;
public interface GeminiService {
    ChatMessage chat(Long userId, String message, String provider);
    String analyzeWithContext(Long userId, String text, String analysisType);
    Map<String, Object> generatePersonalizedInsights(Long userId);
    String getActiveProvider();
}
