package com.saathi.service.impl;

import com.saathi.entity.CommunityPost;
import com.saathi.entity.User;
import com.saathi.exception.SaathiException;
import com.saathi.repository.*;
import com.saathi.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final CommunityPostRepository postRepository;
    private final JournalEntryRepository journalRepository;
    private final MoodEntryRepository moodRepository;
    private final HabitRepository habitRepository;
    private final GoalRepository goalRepository;
    private final ExpertProfileRepository expertRepository;
    private final FocusSessionRepository focusRepository;
    private final ConnectionLogRepository connectionRepository;

    @Override
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new LinkedHashMap<>();

        long totalUsers = userRepository.count();
        long activeToday = userRepository.findAll().stream()
                .filter(u -> u.getLastActiveAt() != null &&
                        u.getLastActiveAt().isAfter(LocalDateTime.now().minusDays(1)))
                .count();
        long activeWeek = userRepository.findAll().stream()
                .filter(u -> u.getLastActiveAt() != null &&
                        u.getLastActiveAt().isAfter(LocalDateTime.now().minusDays(7)))
                .count();

        stats.put("totalUsers", totalUsers);
        stats.put("activeToday", activeToday);
        stats.put("activeThisWeek", activeWeek);
        stats.put("totalJournalEntries", journalRepository.count());
        stats.put("totalMoodEntries", moodRepository.count());
        stats.put("totalHabits", habitRepository.count());
        stats.put("totalGoals", goalRepository.count());
        stats.put("totalCommunityPosts", postRepository.count());
        stats.put("flaggedPosts", postRepository.findByFlaggedFalseOrderByCreatedAtDesc(PageRequest.of(0,1000)).size());
        stats.put("pendingExpertApplications", expertRepository.findByStatus(
                com.saathi.entity.ExpertProfile.ApplicationStatus.PENDING).size());
        stats.put("verifiedExperts", expertRepository.findByVerifiedTrue().size());

        // Role breakdown
        Map<String, Long> roleBreakdown = new HashMap<>();
        for (User.Role role : User.Role.values()) {
            roleBreakdown.put(role.name(),
                    userRepository.findAll().stream().filter(u -> u.getRole() == role).count());
        }
        stats.put("roleBreakdown", roleBreakdown);

        return stats;
    }

    @Override
    public List<User> getAllUsers(int page, int size) {
        return userRepository.findAll(PageRequest.of(page, size)).getContent();
    }

    @Override
    public User updateUserRole(Long userId, User.Role role) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new SaathiException("User not found", HttpStatus.NOT_FOUND));
        user.setRole(role);
        return userRepository.save(user);
    }

    @Override
    public User toggleUserEnabled(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new SaathiException("User not found", HttpStatus.NOT_FOUND));
        user.setEnabled(!user.isEnabled());
        return userRepository.save(user);
    }

    @Override
    public List<CommunityPost> getFlaggedPosts() {
        return postRepository.findAll().stream()
                .filter(CommunityPost::isFlagged)
                .sorted(Comparator.comparing(CommunityPost::getCreatedAt).reversed())
                .toList();
    }

    @Override
    public CommunityPost flagPost(Long postId, boolean flagged) {
        CommunityPost post = postRepository.findById(postId)
                .orElseThrow(() -> new SaathiException("Post not found", HttpStatus.NOT_FOUND));
        post.setFlagged(flagged);
        return postRepository.save(post);
    }

    @Override
    public void deletePost(Long postId) {
        postRepository.deleteById(postId);
    }

    @Override
    public Map<String, Object> getAnalytics() {
        Map<String, Object> analytics = new LinkedHashMap<>();

        // Wellness score across all users (avg mood-related metrics)
        var moods = moodRepository.findAll();
        double avgStress = moods.stream().mapToInt(m -> m.getStressLevel()).average().orElse(0);
        double avgEnergy = moods.stream().mapToInt(m -> m.getEnergyLevel()).average().orElse(0);
        double avgSleep = moods.stream().mapToInt(m -> m.getSleepHours()).average().orElse(0);

        analytics.put("avgCommunityStress", Math.round(avgStress * 10) / 10.0);
        analytics.put("avgCommunityEnergy", Math.round(avgEnergy * 10) / 10.0);
        analytics.put("avgCommunitySleep", Math.round(avgSleep * 10) / 10.0);

        analytics.put("totalFocusMinutes", focusRepository.findAll().stream()
                .filter(f -> f.isCompleted())
                .mapToInt(f -> f.getDurationMinutes()).sum());

        analytics.put("totalConnectionLogs", connectionRepository.count());

        // Mood distribution across community
        Map<String, Long> moodDist = new HashMap<>();
        moods.forEach(m -> moodDist.merge(m.getMood().name(), 1L, Long::sum));
        analytics.put("communityMoodDistribution", moodDist);

        return analytics;
    }
}
