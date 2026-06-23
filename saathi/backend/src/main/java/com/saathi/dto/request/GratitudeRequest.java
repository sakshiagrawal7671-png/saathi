package com.saathi.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class GratitudeRequest {
    @NotBlank private String content;
    private String category;
}
