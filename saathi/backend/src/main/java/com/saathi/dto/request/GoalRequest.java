package com.saathi.dto.request;

import com.saathi.entity.Goal;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDate;

@Data
public class GoalRequest {
    @NotBlank private String title;
    private String description;
    private Goal.GoalCategory category = Goal.GoalCategory.OTHER;
    private LocalDate targetDate;
}
