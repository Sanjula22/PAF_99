package com.levelup.backend.repository;

import com.levelup.backend.entity.ProgressUpdate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProgressUpdateRepository extends JpaRepository<ProgressUpdate, Long> {
    List<ProgressUpdate> findByUserId(Long userId);
    List<ProgressUpdate> findByLearningPlanId(Long learningPlanId);
}