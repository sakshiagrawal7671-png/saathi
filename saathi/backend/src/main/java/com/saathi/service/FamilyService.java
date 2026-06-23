package com.saathi.service;

import com.saathi.dto.request.FamilyMemberRequest;
import com.saathi.entity.FamilyMember;
import java.util.List;

public interface FamilyService {
    FamilyMember addMember(Long userId, FamilyMemberRequest request);
    List<FamilyMember> getMembers(Long userId);
    FamilyMember updateMember(Long userId, Long memberId, FamilyMemberRequest request);
    void deleteMember(Long userId, Long memberId);
    void recordContact(Long userId, Long memberId);
}
