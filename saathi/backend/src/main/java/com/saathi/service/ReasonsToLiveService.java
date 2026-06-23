package com.saathi.service;
import com.saathi.entity.ReasonsToLive;
import com.saathi.entity.WhyIMatter;
import java.util.List;
import java.util.Map;
public interface ReasonsToLiveService {
    ReasonsToLive addReason(Long userId, ReasonsToLive.ReasonCategory category, String content, String emoji);
    List<ReasonsToLive> getReasons(Long userId);
    void deleteReason(Long userId, Long reasonId);
    WhyIMatter getWhyIMatter(Long userId);
    WhyIMatter updateWhyIMatter(Long userId, Map<String, String> fields);
    Map<String, Object> getVaultStatus(Long userId);
}
