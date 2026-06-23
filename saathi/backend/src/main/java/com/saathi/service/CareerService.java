package com.saathi.service;
import com.saathi.entity.CareerGuidance;
import java.util.Map;
public interface CareerService {
    CareerGuidance getOrCreate(Long userId);
    CareerGuidance update(Long userId, Map<String, String> fields);
    CareerGuidance generateGuidance(Long userId);
    Map<String, Object> getFullGuidance(Long userId);
}
