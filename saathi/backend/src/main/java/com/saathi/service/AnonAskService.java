package com.saathi.service;
import com.saathi.entity.AnonAnswer;
import com.saathi.entity.AnonQuestion;
import java.util.List;
public interface AnonAskService {
    AnonQuestion postQuestion(Long userId, String question, AnonQuestion.QuestionCategory category);
    List<AnonQuestion> getQuestions(int page, int size);
    List<AnonQuestion> getByCategory(AnonQuestion.QuestionCategory category, int page);
    AnonAnswer postAnswer(Long userId, Long questionId, String content);
    List<AnonAnswer> getAnswers(Long questionId);
    void supportQuestion(Long questionId);
    void markAnswerHelpful(Long answerId);
}
