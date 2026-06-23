package com.saathi.service;
import com.saathi.entity.ExpertContent;
import com.saathi.entity.ExpertProfile;
import java.util.List;
import java.util.Map;
public interface ExpertService {
    ExpertProfile applyAsExpert(Long userId, ExpertProfile.ExpertType type, String credentials, String bio, String specialization);
    ExpertProfile getMyApplication(Long userId);
    ExpertContent createContent(Long userId, String title, String content, String theme, String icon);
    List<ExpertContent> getAllContent();
    List<ExpertContent> getMyContent(Long userId);
    ExpertContent markHelpful(Long contentId);
    // Admin
    List<ExpertProfile> getPendingApplications();
    ExpertProfile reviewApplication(Long expertId, boolean approve);
    Map<String, Object> getExpertStats(Long userId);
}
