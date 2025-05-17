package com.levelup.backend.entity;

import java.time.LocalDateTime;

public class ProgressUpdateResponse {
    private Long id;
    private String content;
    private String templateType;
    private Long learningPlanId;
    private String learningPlanTitle;
    private LocalDateTime createdAt;

    // Constructor
    public ProgressUpdateResponse(
            Long id,
            String content,
            String templateType,
            Long learningPlanId,
            String learningPlanTitle,
            LocalDateTime createdAt
    ) {
        this.id = id;
        this.content = content;
        this.templateType = templateType;
        this.learningPlanId = learningPlanId;
        this.learningPlanTitle = learningPlanTitle;
        this.createdAt = createdAt;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getTemplateType() {
        return templateType;
    }

    public void setTemplateType(String templateType) {
        this.templateType = templateType;
    }

    public Long getLearningPlanId() {
        return learningPlanId;
    }

    public void setLearningPlanId(Long learningPlanId) {
        this.learningPlanId = learningPlanId;
    }

    public String getLearningPlanTitle() {
        return learningPlanTitle;
    }

    public void setLearningPlanTitle(String learningPlanTitle) {
        this.learningPlanTitle = learningPlanTitle;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}