package com.saathi.service;

import com.saathi.dto.request.CommunityPostRequest;
import com.saathi.entity.CommunityPost;
import com.saathi.entity.PostComment;
import java.util.List;

public interface CommunityService {
    CommunityPost createPost(Long userId, CommunityPostRequest request);
    List<CommunityPost> getPosts(int page, int size);
    List<CommunityPost> getPostsByCategory(CommunityPost.PostCategory category, int page);
    PostComment addComment(Long userId, Long postId, String content, boolean anonymous);
    List<PostComment> getComments(Long postId);
    void supportPost(Long postId);
}
