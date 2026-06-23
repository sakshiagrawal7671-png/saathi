package com.saathi.dto.request;

import com.saathi.entity.MoodEntry;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class MoodRequest {
    @NotNull private MoodEntry.MoodType mood;
    @Min(1) @Max(10) private int stressLevel;
    @Min(1) @Max(10) private int anxietyLevel;
    @Min(0) @Max(12) private int sleepHours;
    @Min(1) @Max(10) private int energyLevel;
    @Min(1) @Max(10) private int motivationLevel;
    @Min(1) @Max(10) private int focusLevel;
    private String note;
    private LocalDate entryDate;
}
