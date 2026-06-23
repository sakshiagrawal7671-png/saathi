package com.saathi.service;
import com.saathi.entity.InnerCircleMember;
import java.util.List;
import java.util.Map;
public interface InnerCircleService {
    InnerCircleMember addMember(Long userId, String name, String relationship, String avatarEmoji,
                                String phone, String sharedMemories, String importantDate, String importantDateLabel);
    List<InnerCircleMember> getCircle(Long userId);
    InnerCircleMember updateMember(Long userId, Long memberId, Map<String, String> fields);
    void removeMember(Long userId, Long memberId);
    void recordInteraction(Long userId, Long memberId);
}
