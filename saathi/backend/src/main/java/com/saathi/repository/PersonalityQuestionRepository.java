package com.saathi.repository;
import com.saathi.entity.PersonalityQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface PersonalityQuestionRepository extends JpaRepository<PersonalityQuestion, Long> {
    List<PersonalityQuestion> findAllByOrderByOrderIndexAsc();
    List<PersonalityQuestion> findByTrait(PersonalityQuestion.BigFiveTrait trait);
}
