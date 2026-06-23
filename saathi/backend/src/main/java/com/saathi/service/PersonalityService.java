package com.saathi.service;
import com.saathi.entity.PersonalityAssessment;
import com.saathi.entity.PersonalityQuestion;
import java.util.List;
import java.util.Map;
public interface PersonalityService {
    List<PersonalityQuestion> getQuestions();
    PersonalityAssessment submitAssessment(Long userId, Map<Long, Integer> answers);
    PersonalityAssessment getResult(Long userId);
    boolean hasCompleted(Long userId);
}
