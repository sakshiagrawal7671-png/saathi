package com.saathi.service.impl;

import com.saathi.dto.request.FamilyMemberRequest;
import com.saathi.entity.FamilyMember;
import com.saathi.entity.User;
import com.saathi.exception.SaathiException;
import com.saathi.repository.FamilyMemberRepository;
import com.saathi.repository.UserRepository;
import com.saathi.service.FamilyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FamilyServiceImpl implements FamilyService {

    private final FamilyMemberRepository familyRepository;
    private final UserRepository userRepository;

    @Override
    public FamilyMember addMember(Long userId, FamilyMemberRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new SaathiException("User not found", HttpStatus.NOT_FOUND));

        FamilyMember member = FamilyMember.builder()
                .user(user)
                .name(request.getName())
                .relationship(request.getRelationship())
                .phone(request.getPhone())
                .email(request.getEmail())
                .avatarUrl(request.getAvatarUrl())
                .birthday(request.getBirthday())
                .notes(request.getNotes())
                .build();

        return familyRepository.save(member);
    }

    @Override
    public List<FamilyMember> getMembers(Long userId) {
        return familyRepository.findByUserIdOrderByNameAsc(userId);
    }

    @Override
    public FamilyMember updateMember(Long userId, Long memberId, FamilyMemberRequest request) {
        FamilyMember member = familyRepository.findById(memberId)
                .orElseThrow(() -> new SaathiException("Member not found", HttpStatus.NOT_FOUND));
        if (!member.getUser().getId().equals(userId))
            throw new SaathiException("Not authorized", HttpStatus.FORBIDDEN);

        member.setName(request.getName());
        member.setRelationship(request.getRelationship());
        member.setPhone(request.getPhone());
        member.setNotes(request.getNotes());
        if (request.getBirthday() != null) member.setBirthday(request.getBirthday());

        return familyRepository.save(member);
    }

    @Override
    public void deleteMember(Long userId, Long memberId) {
        FamilyMember member = familyRepository.findById(memberId)
                .orElseThrow(() -> new SaathiException("Member not found", HttpStatus.NOT_FOUND));
        if (!member.getUser().getId().equals(userId))
            throw new SaathiException("Not authorized", HttpStatus.FORBIDDEN);
        familyRepository.delete(member);
    }

    @Override
    public void recordContact(Long userId, Long memberId) {
        FamilyMember member = familyRepository.findById(memberId)
                .orElseThrow(() -> new SaathiException("Member not found", HttpStatus.NOT_FOUND));
        member.setLastContactedAt(LocalDateTime.now());
        familyRepository.save(member);
    }
}
