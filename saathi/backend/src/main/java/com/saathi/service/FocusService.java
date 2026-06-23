package com.saathi.service;

import com.saathi.dto.request.FocusSessionRequest;
import com.saathi.entity.FocusSession;
import java.util.List;
import java.util.Map;

public interface FocusService {
    FocusSession startSession(Long userId, FocusSessionRequest request);
    FocusSession completeSession(Long userId, Long sessionId);
    List<FocusSession> getSessions(Long userId);
    Map<String, Object> getForestStats(Long userId);
}
