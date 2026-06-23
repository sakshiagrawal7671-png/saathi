package com.saathi.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data @Builder
public class DashboardResponse {
    private UserResponse user;
    private String todayMood;
    private int streakDays;
    private int xpPoints;
    private int level;
    private long journalCount;
    private long gratitudeCount;
    private long habitCount;
    private int focusMinutesToday;
    private List<Map<String, Object>> recentMoods;
    private String dailyWisdom;
    private String dailyChallenge;
}
