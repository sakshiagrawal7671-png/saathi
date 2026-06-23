package com.saathi.dto.request;

import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class FocusSessionRequest {
    @Min(1) private int durationMinutes;
    private String taskDescription;
}
