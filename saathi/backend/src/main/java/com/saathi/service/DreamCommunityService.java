package com.saathi.service;
import com.saathi.entity.DreamCommunity;
import java.util.List;
import java.util.Map;
public interface DreamCommunityService {
    List<DreamCommunity> getAllCommunities();
    DreamCommunity getCommunity(Long communityId);
    void joinCommunity(Long userId, Long communityId);
    void leaveCommunity(Long userId, Long communityId);
    List<DreamCommunity> getMyCommunitities(Long userId);
    boolean isMember(Long userId, Long communityId);
    Map<String, Object> getCommunityStats(Long communityId);
}
