package com.saathi.repository;
import com.saathi.entity.CommunityPost;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface CommunityPostRepository extends JpaRepository<CommunityPost, Long> {
    List<CommunityPost> findByFlaggedFalseOrderByCreatedAtDesc(Pageable pageable);
    List<CommunityPost> findByCategoryAndFlaggedFalseOrderByCreatedAtDesc(CommunityPost.PostCategory category, Pageable pageable);
    List<CommunityPost> findByUserIdOrderByCreatedAtDesc(Long userId);
}
