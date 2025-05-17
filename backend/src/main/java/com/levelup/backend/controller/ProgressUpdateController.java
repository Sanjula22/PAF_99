package com.levelup.backend.controller;

import com.levelup.backend.entity.ProgressUpdate;
import com.levelup.backend.entity.ProgressUpdateResponse;
import com.levelup.backend.service.ProgressUpdateService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/user/progress-updates")
public class ProgressUpdateController {

    private static final Logger logger = LoggerFactory.getLogger(ProgressUpdateController.class);

    @Autowired
    private ProgressUpdateService progressUpdateService;

    @PostMapping
    public ResponseEntity<ProgressUpdate> createProgressUpdate(
            @RequestBody ProgressUpdate progressUpdate,
            @RequestParam(value = "learningPlanId", required = false) Long learningPlanId,
            Principal principal) {
        logger.info("Received POST request for progress update with learningPlanId: {}", learningPlanId);
        ProgressUpdate createdUpdate = progressUpdateService.createProgressUpdate(progressUpdate, learningPlanId, principal);
        return ResponseEntity.ok(createdUpdate);
    }

    @GetMapping
    public ResponseEntity<List<ProgressUpdateResponse>> getProgressUpdatesByUser(Principal principal) {
        logger.info("Received GET request for progress updates by user: {}", principal != null ? principal.getName() : "null");
        List<ProgressUpdateResponse> updates = progressUpdateService.getProgressUpdatesByUser(principal);
        return ResponseEntity.ok(updates);
    }

    @GetMapping("/{updateId}")
    public ResponseEntity<ProgressUpdate> getProgressUpdateById(
            @PathVariable Long updateId,
            Principal principal) {
        logger.info("Received GET request for progress update ID: {}", updateId);
        ProgressUpdate update = progressUpdateService.getProgressUpdateById(updateId, principal);
        return ResponseEntity.ok(update);
    }

    @PutMapping("/{updateId}")
    public ResponseEntity<ProgressUpdate> updateProgressUpdate(
            @PathVariable Long updateId,
            @RequestBody ProgressUpdate progressUpdate,
            @RequestParam(value = "learningPlanId", required = false) Long learningPlanId,
            Principal principal) {
        logger.info("Received PUT request for progress update ID: {} with йому learningPlanId: {}", updateId, learningPlanId);
        ProgressUpdate updatedUpdate = progressUpdateService.updateProgressUpdate(updateId, progressUpdate, learningPlanId, principal);
        return ResponseEntity.ok(updatedUpdate);
    }

    @DeleteMapping("/{updateId}")
    public ResponseEntity<Void> deleteProgressUpdate(
            @PathVariable Long updateId,
            Principal principal) {
        logger.info("Received DELETE request for progress update ID: {}", updateId);
        progressUpdateService.deleteProgressUpdate(updateId, principal);
        return ResponseEntity.noContent().build();
    }
}