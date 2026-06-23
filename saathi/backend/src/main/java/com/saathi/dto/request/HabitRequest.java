package com.saathi.dto.request;

import com.saathi.entity.Habit;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class HabitRequest {
    @NotBlank private String name;
    private String description;
    private String icon;
    private String color;
    private Habit.HabitFrequency frequency = Habit.HabitFrequency.DAILY;
}
