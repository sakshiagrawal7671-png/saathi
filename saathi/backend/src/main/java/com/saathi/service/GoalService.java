package com.saathi.service;

import com.saathi.dto.request.GoalRequest;
import com.saathi.entity.Goal;
import java.util.List;

public interface GoalService {
    Goal createGoal(Long userId, GoalRequest request);
    List<Goal> getGoals(Long userId);
    Goal updateProgress(Long userId, Long goalId, int progress);
    Goal updateStatus(Long userId, Long goalId, Goal.GoalStatus status);
    void deleteGoal(Long userId, Long goalId);
}
