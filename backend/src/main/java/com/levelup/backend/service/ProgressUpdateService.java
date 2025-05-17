package com.levelup.backend.service;

import com.levelup.backend.entity.LearningPlan;
import com.levelup.backend.entity.ProgressUpdate;
import com.levelup.backend.entity.ProgressUpdateResponse;
import com.levelup.backend.entity.User;
import com.levelup.backend.repository.ProgressUpdateRepository;
import com.levelup.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProgressUpdateService {

    private static final Logger logger = LoggerFactory.getLogger(ProgressUpdateService.class);

    @Autowired
    private ProgressUpdateRepository progressUpdateRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LearningPlanService learningPlanService;

    public ProgressUpdate createProgressUpdate(ProgressUpdate progressUpdate, Long learningPlanId, Principal principal) {
        logger.info("Creating progress update for principal: {}", principal != null ? principal.getName() : "null");
        User user = getUserFromPrincipal(principal);
        progressUpdate.setUser(user);
//        if (learningPlanId != null) {
//            logger.debug("Linking to learning plan ID: {}", learningPlanId);
//            learningPlan = learningPlanService.getLearningPlanById(learningPlanId);
//            if (!learningPlan.getUser().getId().equals(user.getId())) {
//                logger.error("Unauthorized attempt to link to learning plan ID: {} by user ID: {}", learningPlanId, user.getId());
//                throw new RuntimeException("Unauthorized to link to this learning plan");
//            }
//            progressUpdate.setLearningPlan(learningPlan);
//        }
        progressUpdate.setCreatedAt(LocalDateTime.now());
        ProgressUpdate savedUpdate = progressUpdateRepository.save(progressUpdate);
        logger.info("Created progress update ID: {}", savedUpdate.getId());
        return savedUpdate;
    }

    public List<ProgressUpdateResponse> getProgressUpdatesByUser(Principal principal) {
        logger.info("Fetching progress updates for principal: {}", principal != null ? principal.getName() : "null");
        User user = getUserFromPrincipal(principal);
        logger.debug("Querying progress updates for user ID: {}", user.getId());
        List<ProgressUpdate> updates = progressUpdateRepository.findByUserId(user.getId());
        List<ProgressUpdateResponse> updateResponses = updates.stream()
                .map(update -> {
                    Long learningPlanId = null;
                    String learningPlanTitle = null;
                    if (update.getLearningPlan() != null) {
                        learningPlanId = update.getLearningPlan().getId();
                        learningPlanTitle = update.getLearningPlan().getTitle();
                    }
                    return new ProgressUpdateResponse(
                            update.getId(),
                            update.getContent(),
                            update.getTemplateType(),
                            learningPlanId,
                            learningPlanTitle,
                            update.getCreatedAt()
                    );
                })
                .collect(Collectors.toList());
        logger.info("Found {} progress updates for user ID: {}", updateResponses.size(), user.getId());
        return updateResponses;
    }

    public List<ProgressUpdateResponse> getProgressUpdatesByUserId(Long userId, Principal principal) {
        logger.info("Fetching progress updates for userId: {} by principal: {}", userId, principal != null ? principal.getName() : "null");
        User authenticatedUser = getUserFromPrincipal(principal);
        if (!authenticatedUser.getId().equals(userId)) {
            logger.error("Unauthorized attempt to view progress updates for user ID: {} by user ID: {}", userId, authenticatedUser.getId());
            throw new RuntimeException("Unauthorized to view progress updates for this user");
        }
        Optional<User> userOptional = userRepository.findById(userId);
        userOptional.orElseThrow(() -> {
            logger.error("User not found for ID: {}", userId);
            return new RuntimeException("User not found");
        });
        List<ProgressUpdate> updates = progressUpdateRepository.findByUserId(userId);
        List<ProgressUpdateResponse> updateResponses = updates.stream()
                .map(update -> {
                    Long learningPlanId = null;
                    String learningPlanTitle = null;
                    if (update.getLearningPlan() != null) {
                        learningPlanId = update.getLearningPlan().getId();
                        learningPlanTitle = update.getLearningPlan().getTitle();
                    }
                    return new ProgressUpdateResponse(
                            update.getId(),
                            update.getContent(),
                            update.getTemplateType(),
                            learningPlanId,
                            learningPlanTitle,
                            update.getCreatedAt()
                    );
                })
                .collect(Collectors.toList());
        logger.info("Found {} progress updates for user ID: {}", updateResponses.size(), userId);
        return updateResponses;
    }

    public List<ProgressUpdateResponse> getProgressUpdatesByLearningPlanId(Long learningPlanId, Principal principal) {
        logger.info("Fetching progress updates for learningPlanId: {} by principal: {}", learningPlanId, principal != null ? principal.getName() : "null");
        LearningPlan learningPlan = learningPlanService.getLearningPlanById(learningPlanId);
        User user = getUserFromPrincipal(principal);
        if (!learningPlan.getUser().getId().equals(user.getId())) {
            logger.error("Unauthorized attempt to view updates for learning plan ID: {} by user ID: {}", learningPlanId, user.getId());
            throw new RuntimeException("Unauthorized to view updates for this learning plan");
        }
        List<ProgressUpdate> updates = progressUpdateRepository.findByLearningPlanId(learningPlanId);
        List<ProgressUpdateResponse> updateResponses = updates.stream()
                .map(update -> {
                    Long lpId = null;
                    String lpTitle = null;
                    if (update.getLearningPlan() != null) {
                        lpId = update.getLearningPlan().getId();
                        lpTitle = update.getLearningPlan().getTitle();
                    }
                    return new ProgressUpdateResponse(
                            update.getId(),
                            update.getContent(),
                            update.getTemplateType(),
                            lpId,
                            lpTitle,
                            update.getCreatedAt()
                    );
                })
                .collect(Collectors.toList());
        logger.info("Found {} progress updates for learning plan ID: {}", updateResponses.size(), learningPlanId);
        return updateResponses;
    }

    public ProgressUpdate getProgressUpdateById(Long updateId, Principal principal) {
        logger.info("Fetching progress update ID: {} by principal: {}", updateId, principal != null ? principal.getName() : "null");
        ProgressUpdate update = progressUpdateRepository.findById(updateId)
                .orElseThrow(() -> {
                    logger.error("Progress update not found for ID: {}", updateId);
                    return new RuntimeException("Progress update not found");
                });
        User user = getUserFromPrincipal(principal);
        if (!update.getUser().getId().equals(user.getId())) {
            logger.error("Unauthorized attempt to view progress update ID: {} by user ID: {}", updateId, user.getId());
            throw new RuntimeException("Unauthorized to view this progress update");
        }
        return update;
    }

    public ProgressUpdate updateProgressUpdate(Long updateId, ProgressUpdate progressUpdate, Long learningPlanId, Principal principal) {
        logger.info("Updating progress update ID: {} by principal: {}", updateId, principal != null ? principal.getName() : "null");
        ProgressUpdate existingUpdate = getProgressUpdateById(updateId, principal);
        User user = getUserFromPrincipal(principal);
        existingUpdate.setContent(progressUpdate.getContent());
        existingUpdate.setTemplateType(progressUpdate.getTemplateType());
        if (learningPlanId != null) {
            logger.debug("Linking to learning plan ID: {}", learningPlanId);
            LearningPlan learningPlan = learningPlanService.getLearningPlanById(learningPlanId);
            if (!learningPlan.getUser().getId().equals(user.getId())) {
                logger.error("Unauthorized attempt to link to learning plan ID: {} by user ID: {}", learningPlanId, user.getId());
                throw new RuntimeException("Unauthorized to link to this learning plan");
            }
            existingUpdate.setLearningPlan(learningPlan);
        } else {
            existingUpdate.setLearningPlan(null);
        }
        ProgressUpdate updatedUpdate = progressUpdateRepository.save(existingUpdate);
        logger.info("Updated progress update ID: {}", updatedUpdate.getId());
        return updatedUpdate;
    }

    public void deleteProgressUpdate(Long updateId, Principal principal) {
        logger.info("Deleting progress update ID: {} by principal: {}", updateId, principal != null ? principal.getName() : "null");
        ProgressUpdate existingUpdate = getProgressUpdateById(updateId, principal);
        progressUpdateRepository.deleteById(updateId);
        logger.info("Deleted progress update ID: {}", updateId);
    }

    private User getUserFromPrincipal(Principal principal) {
        if (principal == null || principal.getName() == null) {
            logger.error("Principal is null or has no name");
            throw new RuntimeException("Authentication required");
        }
        logger.debug("Fetching user for email: {}", principal.getName());
        return userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> {
                    logger.error("User not found for email: {}", principal.getName());
                    return new RuntimeException("User not found for email: " + principal.getName());
                });
    }
}