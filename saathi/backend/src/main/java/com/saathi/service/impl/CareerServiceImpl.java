package com.saathi.service.impl;

import com.saathi.entity.*;
import com.saathi.exception.SaathiException;
import com.saathi.repository.*;
import com.saathi.service.CareerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class CareerServiceImpl implements CareerService {

    private final CareerGuidanceRepository careerRepo;
    private final UserRepository userRepository;
    private final PersonalityAssessmentRepository personalityRepo;
    private final PurposeProfileRepository purposeRepo;

    @Override
    public CareerGuidance getOrCreate(Long userId) {
        return careerRepo.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new SaathiException("User not found", HttpStatus.NOT_FOUND));
            return careerRepo.save(CareerGuidance.builder().user(user).build());
        });
    }

    @Override
    public CareerGuidance update(Long userId, Map<String, String> fields) {
        CareerGuidance cg = getOrCreate(userId);
        if (fields.containsKey("currentRole"))    cg.setCurrentRole(fields.get("currentRole"));
        if (fields.containsKey("educationLevel")) cg.setEducationLevel(fields.get("educationLevel"));
        if (fields.containsKey("fieldOfStudy"))   cg.setFieldOfStudy(fields.get("fieldOfStudy"));
        if (fields.containsKey("skills"))         cg.setSkills(fields.get("skills"));
        if (fields.containsKey("interests"))      cg.setInterests(fields.get("interests"));
        if (fields.containsKey("careerGoal"))     cg.setCareerGoal(fields.get("careerGoal"));
        return careerRepo.save(cg);
    }

    @Override
    public CareerGuidance generateGuidance(Long userId) {
        CareerGuidance cg = getOrCreate(userId);

        // Pull personality data if available
        Optional<PersonalityAssessment> pa = personalityRepo.findByUserId(userId);
        Optional<PurposeProfile> pp = purposeRepo.findByUserId(userId);

        // Build recommended careers
        List<String> careers = new ArrayList<>();
        String skills = cg.getSkills() != null ? cg.getSkills().toLowerCase() : "";
        String interests = cg.getInterests() != null ? cg.getInterests().toLowerCase() : "";
        String goal = cg.getCareerGoal() != null ? cg.getCareerGoal().toLowerCase() : "";

        if (skills.contains("code") || skills.contains("program") || interests.contains("tech"))
            careers.addAll(List.of("Software Engineer", "Full Stack Developer", "Product Manager", "Data Scientist"));
        if (skills.contains("design") || interests.contains("art") || interests.contains("creat"))
            careers.addAll(List.of("UX/UI Designer", "Creative Director", "Brand Strategist"));
        if (skills.contains("teach") || interests.contains("educat") || goal.contains("help"))
            careers.addAll(List.of("Teacher/Educator", "Curriculum Designer", "EdTech Specialist"));
        if (skills.contains("write") || skills.contains("content") || interests.contains("story"))
            careers.addAll(List.of("Content Writer", "Journalist", "Marketing Strategist"));
        if (skills.contains("business") || interests.contains("entrepreneur") || goal.contains("start"))
            careers.addAll(List.of("Entrepreneur", "Business Analyst", "Management Consultant"));
        if (skills.contains("health") || skills.contains("medic") || interests.contains("wellness"))
            careers.addAll(List.of("Healthcare Professional", "Wellness Coach", "Psychologist"));

        pa.ifPresent(p -> {
            if (notBlank(p.getCareerMatches()))
                Arrays.stream(p.getCareerMatches().split(",")).map(String::trim).forEach(careers::add);
        });

        if (careers.isEmpty())
            careers.addAll(List.of("Consultant", "Project Manager", "Business Analyst", "Entrepreneur"));

        String careerList = careers.stream().distinct().limit(6).reduce((a,b)->a+", "+b).orElse("Consultant");
        cg.setRecommendedCareers(careerList);

        // Build skill roadmap
        StringBuilder roadmap = new StringBuilder();
        roadmap.append("🎯 Your Personalised Skill Roadmap:\n\n");
        roadmap.append("Phase 1 — Foundation (Months 1-3):\n");
        roadmap.append("• Identify your top 3 skills to deepen\n");
        roadmap.append("• Take one structured online course in your target field\n");
        roadmap.append("• Build a portfolio or document your work\n\n");
        roadmap.append("Phase 2 — Growth (Months 4-6):\n");
        roadmap.append("• Seek a mentor or join a professional community\n");
        roadmap.append("• Apply your skills in a real project\n");
        roadmap.append("• Attend networking events or connect on LinkedIn\n\n");
        roadmap.append("Phase 3 — Momentum (Months 7-12):\n");
        roadmap.append("• Pursue an internship, freelance project, or job application\n");
        roadmap.append("• Build your personal brand online\n");
        roadmap.append("• Reflect and adjust your roadmap every 90 days");
        cg.setSkillRoadmap(roadmap.toString());

        // Learning resources
        StringBuilder resources = new StringBuilder();
        resources.append("📚 Recommended Learning Resources:\n\n");
        resources.append("Free Platforms:\n");
        resources.append("• Coursera, edX, Khan Academy — structured courses\n");
        resources.append("• YouTube — tutorials and deep dives\n");
        resources.append("• GitHub — open source projects\n\n");
        resources.append("Books for Growth:\n");
        resources.append("• 'Mindset' by Carol Dweck\n");
        resources.append("• 'Deep Work' by Cal Newport\n");
        resources.append("• 'So Good They Can't Ignore You' by Cal Newport\n");
        resources.append("• 'The Lean Startup' by Eric Ries\n\n");
        resources.append("Communities:\n");
        resources.append("• Reddit communities for your field\n");
        resources.append("• Discord servers and LinkedIn groups\n");
        resources.append("• Local meetup groups and hackathons");
        cg.setLearningResources(resources.toString());

        // 90-day action plan
        StringBuilder plan = new StringBuilder();
        plan.append("🚀 Your 90-Day Action Plan:\n\n");
        plan.append("Week 1-2: Clarity\n");
        plan.append("• Complete your purpose discovery profile\n");
        plan.append("• Research your top 3 career paths\n");
        plan.append("• Talk to one person currently working in your target field\n\n");
        plan.append("Week 3-6: Foundation\n");
        plan.append("• Enrol in one skill-building course\n");
        plan.append("• Dedicate 1 hour/day to focused learning\n");
        plan.append("• Create or update your portfolio/resume\n\n");
        plan.append("Week 7-10: Action\n");
        plan.append("• Apply to 3 internships, jobs, or projects\n");
        plan.append("• Reach out to 5 professionals for informational interviews\n");
        plan.append("• Join one professional community or group\n\n");
        plan.append("Week 11-13: Review\n");
        plan.append("• Reflect on what's working and what isn't\n");
        plan.append("• Celebrate progress — no matter how small\n");
        plan.append("• Set goals for the next 90 days");
        cg.setActionPlan(plan.toString());

        return careerRepo.save(cg);
    }

    @Override
    public Map<String, Object> getFullGuidance(Long userId) {
        Map<String, Object> result = new HashMap<>();
        result.put("guidance", getOrCreate(userId));
        personalityRepo.findByUserId(userId).ifPresent(p -> result.put("personality", p));
        purposeRepo.findByUserId(userId).ifPresent(p -> result.put("purpose", p));
        return result;
    }

    private boolean notBlank(String s) { return s != null && !s.isBlank(); }
}
