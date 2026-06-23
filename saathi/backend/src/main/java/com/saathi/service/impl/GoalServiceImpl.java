package com.saathi.service.impl;

import com.saathi.dto.request.GoalRequest;
import com.saathi.entity.Goal;
import com.saathi.entity.User;
import com.saathi.exception.SaathiException;
import com.saathi.repository.GoalRepository;
import com.saathi.repository.UserRepository;
import com.saathi.service.GoalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GoalServiceImpl implements GoalService {

    private final GoalRepository goalRepository;
    private final UserRepository userRepository;

    @Override
    public Goal createGoal(Long userId, GoalRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new SaathiException("User not found", HttpStatus.NOT_FOUND));

        Goal goal = Goal.builder()
                .user(user)
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .targetDate(request.getTargetDate())
                .build();

        return goalRepository.save(goal);
    }

    @Override
    public List<Goal> getGoals(Long userId) {
        return goalRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Override
    public Goal updateProgress(Long userId, Long goalId, int progress) {
        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new SaathiException("Goal not found", HttpStatus.NOT_FOUND));
        validateOwnership(goal.getUser().getId(), userId);
        goal.setProgress(Math.min(100, Math.max(0, progress)));
        if (goal.getProgress() == 100) goal.setStatus(Goal.GoalStatus.COMPLETED);
        return goalRepository.save(goal);
    }

    @Override
    public Goal updateStatus(Long userId, Long goalId, Goal.GoalStatus status) {
        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new SaathiException("Goal not found", HttpStatus.NOT_FOUND));
        validateOwnership(goal.getUser().getId(), userId);
        goal.setStatus(status);
        return goalRepository.save(goal);
    }

    @Override
    public void deleteGoal(Long userId, Long goalId) {
        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new SaathiException("Goal not found", HttpStatus.NOT_FOUND));
        validateOwnership(goal.getUser().getId(), userId);
        goalRepository.delete(goal);
    }

    private void validateOwnership(Long ownerId, Long requesterId) {
        if (!ownerId.equals(requesterId))
            throw new SaathiException("Not authorized", HttpStatus.FORBIDDEN);
    }
}
