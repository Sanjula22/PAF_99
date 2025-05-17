package com.levelup.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.levelup.backend.entity.LearningPlan;
import com.levelup.backend.entity.LearningPlanResponse;
import com.levelup.backend.entity.User;
import com.levelup.backend.repository.LearningPlanRepository;

@Service
public class LearningPlanService {

    @Autowired
    private LearningPlanRepository learningPlanRepository;

    public LearningPlan save(LearningPlan plan) {
        return learningPlanRepository.save(plan);
    }

    public List<LearningPlanResponse> getAllPlansAsResponse() {
        List<LearningPlan> plans = learningPlanRepository.findAll();

        return plans.stream()
                .map(plan -> {
                    User user = plan.getUser(); // make sure this is not lazy/null
                    String username = (user != null) ? user.getUsername() : "Anonymous";
                    String profileImage = (user != null) ? user.getProfileImage() : null;

                    return new LearningPlanResponse(
                            plan.getId(),
                            plan.getTitle(),
                            plan.getTopics(),
                            plan.getResources(),
                            plan.getTargetDate(),
                            plan.getProgress(),
                            username,
                            profileImage
                    );
                })
                .toList();
    }

    public List<LearningPlan> getPlansByUser(User user) {
        return learningPlanRepository.findByUser(user);
    }

    public void deleteById(Long id) {
        learningPlanRepository.deleteById(id);
    }

    public LearningPlan getPlanById(Long id) {
        return learningPlanRepository.findById(id).orElseThrow();
    }

    public LearningPlan getLearningPlanById(Long id) {
        LearningPlan plan = learningPlanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Learning plan not found"));

//        String email = SecurityContextHolder.getContext().getAuthentication().getName();
//        Optional<User> userOptional = userRepository.findByEmail(email);
//        User authenticatedUser = userOptional.orElseThrow(() -> new RuntimeException("Authenticated user not found"));
//
//        if (!plan.getUser().getId().equals(authenticatedUser.getId())) {
//            throw new RuntimeException("Unauthorized to access this learning plan");
//        }

        return plan;
    }

}
