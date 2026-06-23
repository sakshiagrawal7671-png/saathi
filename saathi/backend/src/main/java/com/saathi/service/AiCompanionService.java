package com.saathi.service;

import com.saathi.entity.ChatMessage;
import java.util.List;

public interface AiCompanionService {
    ChatMessage chat(Long userId, String message);
    List<ChatMessage> getChatHistory(Long userId);
    void clearHistory(Long userId);
    String analyzeText(String text);
}
