package com.saathi.service.impl;

import com.saathi.entity.*;
import com.saathi.exception.SaathiException;
import com.saathi.repository.*;
import com.saathi.service.AnonAskService;
import com.saathi.service.GamificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AnonAskServiceImpl implements AnonAskService {

    private final AnonQuestionRepository questionRepo;
    private final AnonAnswerRepository answerRepo;
    private final UserRepository userRepository;
    private final GamificationService gamificationService;

    @Override
    public AnonQuestion postQuestion(Long userId, String question, AnonQuestion.QuestionCategory category) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new SaathiException("User not found", HttpStatus.NOT_FOUND));
        AnonQuestion q = questionRepo.save(AnonQuestion.builder()
                .user(user).question(question)
                .category(category != null ? category : AnonQuestion.QuestionCategory.GENERAL).build());
        gamificationService.awardXP(userId, 10, "Posted anonymous question");
        return q;
    }

    @Override
    public List<AnonQuestion> getQuestions(int page, int size) {
        return questionRepo.findByFlaggedFalseOrderByCreatedAtDesc(PageRequest.of(page, size));
    }

    @Override
    public List<AnonQuestion> getByCategory(AnonQuestion.QuestionCategory category, int page) {
        return questionRepo.findByCategoryAndFlaggedFalseOrderByCreatedAtDesc(category, PageRequest.of(page, 20));
    }

    @Override
    public AnonAnswer postAnswer(Long userId, Long questionId, String content) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new SaathiException("User not found", HttpStatus.NOT_FOUND));
        AnonQuestion q = questionRepo.findById(questionId)
                .orElseThrow(() -> new SaathiException("Question not found", HttpStatus.NOT_FOUND));

        AnonAnswer answer = answerRepo.save(AnonAnswer.builder().question(q).user(user).content(content).build());

        q.setAnswerCount(q.getAnswerCount() + 1);
        questionRepo.save(q);

        gamificationService.awardXP(userId, 15, "Helped someone with an answer");
        return answer;
    }

    @Override
    public List<AnonAnswer> getAnswers(Long questionId) {
        return answerRepo.findByQuestionIdOrderByCreatedAtAsc(questionId);
    }

    @Override
    public void supportQuestion(Long questionId) {
        questionRepo.findById(questionId).ifPresent(q -> {
            q.setSupportCount(q.getSupportCount() + 1);
            questionRepo.save(q);
        });
    }

    @Override
    public void markAnswerHelpful(Long answerId) {
        answerRepo.findById(answerId).ifPresent(a -> {
            a.setHelpfulCount(a.getHelpfulCount() + 1);
            answerRepo.save(a);
        });
    }
}
