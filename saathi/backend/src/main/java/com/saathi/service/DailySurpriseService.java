package com.saathi.service;
import com.saathi.entity.DailySurprise;
import java.util.List;
public interface DailySurpriseService {
    List<DailySurprise> getTodaysSurprises(Long userId);
    DailySurprise openSurprise(Long userId, Long surpriseId);
    DailySurprise completeSurprise(Long userId, Long surpriseId);
}
