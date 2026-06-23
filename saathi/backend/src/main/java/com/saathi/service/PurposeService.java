package com.saathi.service;
import com.saathi.entity.PurposeProfile;
import com.saathi.entity.ValueCard;
import java.util.List;
import java.util.Map;
public interface PurposeService {
    PurposeProfile getOrCreate(Long userId);
    PurposeProfile update(Long userId, Map<String, String> fields);
    PurposeProfile generatePurposeStatement(Long userId);
    List<ValueCard> getValues(Long userId);
    void saveValues(Long userId, List<Map<String, Object>> values);
    Map<String, Object> getFullProfile(Long userId);
}
