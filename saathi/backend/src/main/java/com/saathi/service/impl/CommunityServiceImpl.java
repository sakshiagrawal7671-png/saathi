package com.saathi.service.impl;

import com.saathi.dto.request.CommunityPostRequest;
import com.saathi.entity.CommunityPost;
import com.saathi.entity.PostComment;
import com.saathi.entity.User;
import com.saathi.exception.SaathiException;
import com.saathi.repository.CommunityPostRepository;
import com.saathi.repository.PostCommentRepository;
import com.saathi.repository.UserRepository;
import com.saathi.service.CommunityService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommunityServiceImpl implements CommunityService {

    private final CommunityPostRepository postRepository;
    private final PostCommentRepository commentRepository;
    private final UserRepository userRepository;

    @Override
    public CommunityPost createPost(Long userId, CommunityPostRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new SaathiException("User not found", HttpStatus.NOT_FOUND));

        CommunityPost post = CommunityPost.builder()
                .user(user)
                .title(request.getTitle())
                .content(request.getContent())
                .category(request.getCategory())
                .anonymous(request.isAnonymous())
                .build();

        return postRepository.save(post);
    }

    @Override
    public List<CommunityPost> getPosts(int page, int size) {
        return postRepository.findByFlaggedFalseOrderByCreatedAtDesc(PageRequest.of(page, size));
    }

    @Override
    public List<CommunityPost> getPostsByCategory(CommunityPost.PostCategory category, int page) {
        return postRepository.findByCategoryAndFlaggedFalseOrderByCreatedAtDesc(category, PageRequest.of(page, 20));
    }

    @Override
    public PostComment addComment(Long userId, Long postId, String content, boolean anonymous) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new SaathiException("User not found", HttpStatus.NOT_FOUND));
        CommunityPost post = postRepository.findById(postId)
                .orElseThrow(() -> new SaathiException("Post not found", HttpStatus.NOT_FOUND));

        PostComment comment = PostComment.builder()
                .post(post).user(user).content(content).anonymous(anonymous).build();
        return commentRepository.save(comment);
    }

    @Override
    public List<PostComment> getComments(Long postId) {
        return commentRepository.findByPostIdOrderByCreatedAtAsc(postId);
    }

    @Override
    public void supportPost(Long postId) {
        CommunityPost post = postRepository.findById(postId)
                .orElseThrow(() -> new SaathiException("Post not found", HttpStatus.NOT_FOUND));
        post.setSupportCount(post.getSupportCount() + 1);
        postRepository.save(post);
    }
}
