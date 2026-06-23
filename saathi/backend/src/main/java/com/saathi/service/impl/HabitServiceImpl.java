package com.saathi.service.impl;

import com.saathi.dto.request.HabitRequest;
import com.saathi.entity.Habit;
import com.saathi.entity.HabitLog;
import com.saathi.entity.User;
import com.saathi.exception.SaathiException;
import com.saathi.repository.HabitLogRepository;
import com.saathi.repository.HabitRepository;
import com.saathi.repository.UserRepository;
import com.saathi.service.HabitService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class HabitServiceImpl implements HabitService {

    private final HabitRepository habitRepository;
    private final HabitLogRepository habitLogRepository;
    private final UserRepository userRepository;

    @Override
    public Habit createHabit(Long userId, HabitRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new SaathiException("User not found", HttpStatus.NOT_FOUND));

        Habit habit = Habit.builder()
                .user(user)
                .name(request.getName())
                .description(request.getDescription())
                .icon(request.getIcon())
                .color(request.getColor())
                .frequency(request.getFrequency())
                .build();

        return habitRepository.save(habit);
    }

    @Override
    public List<Habit> getHabits(Long userId) {
        return habitRepository.findByUserIdAndActiveTrue(userId);
    }

    @Override
    public HabitLog logHabit(Long userId, Long habitId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new SaathiException("User not found", HttpStatus.NOT_FOUND));
        Habit habit = habitRepository.findById(habitId)
                .orElseThrow(() -> new SaathiException("Habit not found", HttpStatus.NOT_FOUND));

        LocalDate today = LocalDate.now();
        Optional<HabitLog> existing = habitLogRepository.findByHabitIdAndLogDate(habitId, today);

        HabitLog log;
        if (existing.isPresent()) {
            log = existing.get();
            log.setCompleted(!log.isCompleted());
        } else {
            log = HabitLog.builder().habit(habit).user(user).logDate(today).completed(true).build();
            habit.setCurrentStreak(habit.getCurrentStreak() + 1);
            habit.setTotalCompletions(habit.getTotalCompletions() + 1);
            if (habit.getCurrentStreak() > habit.getLongestStreak())
                habit.setLongestStreak(habit.getCurrentStreak());
            habitRepository.save(habit);
        }

        return habitLogRepository.save(log);
    }

    @Override
    public Map<String, Object> getTodayProgress(Long userId) {
        List<Habit> habits = habitRepository.findByUserIdAndActiveTrue(userId);
        List<HabitLog> todayLogs = habitLogRepository.findByUserIdAndLogDate(userId, LocalDate.now());

        Map<String, Object> progress = new HashMap<>();
        progress.put("total", habits.size());
        progress.put("completed", todayLogs.stream().filter(HabitLog::isCompleted).count());
        return progress;
    }

    @Override
    public void deleteHabit(Long userId, Long habitId) {
        Habit habit = habitRepository.findById(habitId)
                .orElseThrow(() -> new SaathiException("Habit not found", HttpStatus.NOT_FOUND));
        if (!habit.getUser().getId().equals(userId))
            throw new SaathiException("Not authorized", HttpStatus.FORBIDDEN);
        habit.setActive(false);
        habitRepository.save(habit);
    }
}
