package com.codeforge.controller;

import com.codeforge.dto.ProblemDto;
import com.codeforge.entity.User;
import com.codeforge.service.ProblemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/problems")
@RequiredArgsConstructor
public class ProblemController {

    private final ProblemService problemService;

    @GetMapping
    public ResponseEntity<ProblemDto.ProblemListResponse> getProblems(
            Authentication auth,
            @RequestParam(required = false) Long topicId,
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long companyId,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        User user = (User) auth.getPrincipal();
        return ResponseEntity.ok(problemService.getProblems(user, topicId, difficulty, search, companyId, status, page, size));
    }

    @GetMapping("/topics")
    public ResponseEntity<List<ProblemDto.TopicResponse>> getTopics() {
        return ResponseEntity.ok(problemService.getTopics());
    }

    @GetMapping("/topic/{topicId}")
    public ResponseEntity<ProblemDto.TopicDetailsResponse> getTopicDetails(Authentication auth, @PathVariable Long topicId) {
        User user = (User) auth.getPrincipal();
        return ResponseEntity.ok(problemService.getTopicDetails(user, topicId));
    }

    @GetMapping("/topics/details")
    public ResponseEntity<List<ProblemDto.TopicDetailsResponse>> getAllTopicDetails(Authentication auth) {
        User user = (User) auth.getPrincipal();
        return ResponseEntity.ok(problemService.getAllTopicDetails(user));
    }

    @PostMapping("/{id}/bookmark")
    public ResponseEntity<Void> toggleBookmark(Authentication auth, @PathVariable Long id) {
        User user = (User) auth.getPrincipal();
        problemService.toggleBookmark(user, id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/solve")
    public ResponseEntity<Void> markSolved(Authentication auth, @PathVariable Long id) {
        User user = (User) auth.getPrincipal();
        problemService.markSolved(user, id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProblemDto.ProblemResponse> getProblemById(
            Authentication auth, @PathVariable Long id) {
        User user = (User) auth.getPrincipal();
        return ResponseEntity.ok(problemService.getProblemById(user, id));
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<ProblemDto.SubmitResult> submitProblem(
            Authentication auth,
            @PathVariable Long id,
            @RequestBody ProblemDto.ProblemSubmitRequest request) {
        User user = (User) auth.getPrincipal();
        return ResponseEntity.ok(problemService.submitProblem(user, id, request.getSourceCode(), request.getLanguageId()));
    }

    @PostMapping("/{id}/run")
    public ResponseEntity<ProblemDto.SubmitResult> runSampleTestCases(
            Authentication auth,
            @PathVariable Long id,
            @RequestBody ProblemDto.ProblemSubmitRequest request) {
        User user = (User) auth.getPrincipal();
        return ResponseEntity.ok(problemService.runSampleTestCases(user, id, request.getSourceCode(), request.getLanguageId()));
    }
}
