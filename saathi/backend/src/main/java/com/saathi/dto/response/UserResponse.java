package com.saathi.dto.response;

import com.saathi.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Set;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String avatarUrl;
    private String bio;
    private User.Role role;
    private int xpPoints;
    private int level;
    private int streakDays;
    private Set<String> interests;

    public static UserResponse from(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .avatarUrl(user.getAvatarUrl())
                .bio(user.getBio())
                .role(user.getRole())
                .xpPoints(user.getXpPoints())
                .level(user.getLevel())
                .streakDays(user.getStreakDays())
                .interests(user.getInterests())
                .build();
    }
}
