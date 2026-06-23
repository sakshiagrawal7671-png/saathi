package com.saathi.dto.request;

import com.saathi.entity.CommunityPost;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CommunityPostRequest {
    @NotBlank private String title;
    @NotBlank private String content;
    private CommunityPost.PostCategory category = CommunityPost.PostCategory.GENERAL;
    private boolean anonymous = false;
}
