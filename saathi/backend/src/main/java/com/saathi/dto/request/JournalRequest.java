package com.saathi.dto.request;

import com.saathi.entity.JournalEntry;
import com.saathi.entity.MoodEntry;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class JournalRequest {
    @NotBlank private String title;
    private String content;
    private MoodEntry.MoodType mood;
    private boolean isPrivate = true;
    private JournalEntry.JournalType type = JournalEntry.JournalType.TEXT;
}
