package com.saathi.service;

import com.saathi.entity.CommunityPost;
import com.saathi.entity.User;
import java.util.List;
import java.util.Map;

public interface AdminService {
    Map<String, Object> getDashboardStats();
    List<User> getAllUsers(int page, int size);
    User updateUserRole(Long userId, User.Role role);
    User toggleUserEnabled(Long userId);
    List<CommunityPost> getFlaggedPosts();
    CommunityPost flagPost(Long postId, boolean flagged);
    void deletePost(Long postId);
    Map<String, Object> getAnalytics();
}
