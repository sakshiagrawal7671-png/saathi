package com.saathi.service.impl;

import com.saathi.entity.*;
import com.saathi.exception.SaathiException;
import com.saathi.repository.*;
import com.saathi.service.DreamCommunityService;
import com.saathi.service.GamificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class DreamCommunityServiceImpl implements DreamCommunityService {

    private final DreamCommunityRepository communityRepo;
    private final CommunityMembershipRepository membershipRepo;
    private final UserRepository userRepository;
    private final GamificationService gamificationService;

    private static final List<Object[]> SEED_COMMUNITIES = List.of(
        new Object[]{"JEE Aspirants",       "Supporting each other on the journey to IIT", "🎯", "#ef4444", "JEE"},
        new Object[]{"NEET Warriors",        "Future doctors motivating each other",          "⚕️", "#10b981", "NEET"},
        new Object[]{"Developers' Den",      "Builders, coders, and tech dreamers",            "💻", "#7c3aed", "DEVELOPERS"},
        new Object[]{"Entrepreneurs",        "Building something from nothing together",       "🚀", "#f97316", "ENTREPRENEURS"},
        new Object[]{"Designers' Circle",    "Creators, artists, and visual thinkers",         "🎨", "#ec4899", "DESIGNERS"},
        new Object[]{"Writers' Room",        "Stories waiting to be told",                     "✍️", "#0ea5e9", "WRITERS"},
        new Object[]{"Fitness Community",    "Moving our bodies, changing our lives",          "💪", "#84cc16", "FITNESS"},
        new Object[]{"Meditation & Mindfulness", "Finding peace in a busy world",             "🧘", "#a78bfa", "MEDITATION"},
        new Object[]{"Language Learners",    "Learning new languages, new worlds",             "🌏", "#f59e0b", "LANGUAGE_LEARNING"},
        new Object[]{"General Support",      "For everything else — you belong here",          "💜", "#8b5cf6", "GENERAL"}
    );

    @Override
    public List<DreamCommunity> getAllCommunities() {
        if (communityRepo.count() == 0) seedCommunities();
        return communityRepo.findByActiveTrueOrderByMemberCountDesc();
    }

    private void seedCommunities() {
        List<DreamCommunity> communities = new ArrayList<>();
        for (Object[] s : SEED_COMMUNITIES)
            communities.add(DreamCommunity.builder()
                    .name((String) s[0]).description((String) s[1]).icon((String) s[2])
                    .colorTheme((String) s[3]).goal(DreamCommunity.CommunityGoal.valueOf((String) s[4])).build());
        communityRepo.saveAll(communities);
    }

    @Override
    public DreamCommunity getCommunity(Long communityId) {
        return communityRepo.findById(communityId)
                .orElseThrow(() -> new SaathiException("Community not found", HttpStatus.NOT_FOUND));
    }

    @Override
    public void joinCommunity(Long userId, Long communityId) {
        if (membershipRepo.existsByUserIdAndCommunityId(userId, communityId)) return;

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new SaathiException("User not found", HttpStatus.NOT_FOUND));
        DreamCommunity community = getCommunity(communityId);

        membershipRepo.save(CommunityMembership.builder().user(user).community(community).build());
        community.setMemberCount(community.getMemberCount() + 1);
        communityRepo.save(community);
        gamificationService.awardXP(userId, 10, "Joined community: " + community.getName());
    }

    @Override
    public void leaveCommunity(Long userId, Long communityId) {
        membershipRepo.findByUserIdAndCommunityId(userId, communityId).ifPresent(m -> {
            membershipRepo.delete(m);
            communityRepo.findById(communityId).ifPresent(c -> {
                c.setMemberCount(Math.max(0, c.getMemberCount() - 1));
                communityRepo.save(c);
            });
        });
    }

    @Override
    public List<DreamCommunity> getMyCommunitities(Long userId) {
        return membershipRepo.findByUserId(userId).stream()
                .map(CommunityMembership::getCommunity).toList();
    }

    @Override
    public boolean isMember(Long userId, Long communityId) {
        return membershipRepo.existsByUserIdAndCommunityId(userId, communityId);
    }

    @Override
    public Map<String, Object> getCommunityStats(Long communityId) {
        DreamCommunity c = getCommunity(communityId);
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("community", c);
        stats.put("memberCount", membershipRepo.countByCommunityId(communityId));
        return stats;
    }
}
