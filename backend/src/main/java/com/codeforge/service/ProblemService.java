package com.codeforge.service;

import com.codeforge.dto.ProblemDto;
import com.codeforge.entity.Problem;
import com.codeforge.entity.Subtopic;
import com.codeforge.entity.User;
import com.codeforge.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProblemService {

    private final ProblemRepository problemRepository;
    private final TopicRepository topicRepository;
    private final SubmissionRepository submissionRepository;
    private final BookmarkRepository bookmarkRepository;
    private final SubtopicRepository subtopicRepository;
    private final NotificationService notificationService;

    public ProblemDto.ProblemListResponse getProblems(User user, Long topicId, String difficulty,
                                                       String search, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("id").ascending());
        Page<Problem> problemPage;

        if (search != null && !search.isBlank()) {
            problemPage = problemRepository.searchByTitle(search, pageRequest);
        } else if (topicId != null && difficulty != null && !difficulty.isBlank()) {
            problemPage = problemRepository.findByTopicIdAndDifficulty(topicId, Problem.Difficulty.valueOf(difficulty.toUpperCase()), pageRequest);
        } else if (topicId != null) {
            problemPage = problemRepository.findByTopicId(topicId, pageRequest);
        } else if (difficulty != null && !difficulty.isBlank()) {
            problemPage = problemRepository.findByDifficulty(Problem.Difficulty.valueOf(difficulty.toUpperCase()), pageRequest);
        } else {
            problemPage = problemRepository.findAll(pageRequest);
        }

        Set<Long> solvedIds = submissionRepository.findSolvedProblemIdsByUserId(user.getId())
                .stream().collect(Collectors.toSet());
        Set<Long> bookmarkedIds = bookmarkRepository.findBookmarkedProblemIdsByUserId(user.getId())
                .stream().collect(Collectors.toSet());

        List<ProblemDto.ProblemResponse> problems = problemPage.getContent().stream()
                .map(p -> mapToResponse(p, solvedIds, bookmarkedIds))
                .collect(Collectors.toList());

        return ProblemDto.ProblemListResponse.builder()
                .problems(problems)
                .totalPages(problemPage.getTotalPages())
                .totalElements(problemPage.getTotalElements())
                .currentPage(page)
                .build();
    }

    public List<ProblemDto.TopicResponse> getTopics() {
        return topicRepository.findAll().stream()
                .map(t -> ProblemDto.TopicResponse.builder()
                        .id(t.getId())
                        .name(t.getName())
                        .icon(t.getIcon())
                        .problemCount(t.getProblemCount())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public void toggleBookmark(User user, Long problemId) {
        var existing = bookmarkRepository.findByUserIdAndProblemId(user.getId(), problemId);
        if (existing.isPresent()) {
            bookmarkRepository.delete(existing.get());
        } else {
            var problem = problemRepository.findById(problemId)
                    .orElseThrow(() -> new RuntimeException("Problem not found"));
            var bookmark = com.codeforge.entity.Bookmark.builder()
                    .user(user)
                    .problem(problem)
                    .build();
            bookmarkRepository.save(bookmark);
        }
    }

    @Transactional
    public void markSolved(User user, Long problemId) {
        var existing = submissionRepository.findByUserIdAndProblemId(user.getId(), problemId);
        if (existing.isEmpty()) {
            var problem = problemRepository.findById(problemId)
                    .orElseThrow(() -> new RuntimeException("Problem not found"));
            var submission = com.codeforge.entity.Submission.builder()
                    .user(user)
                    .problem(problem)
                    .solved(true)
                    .build();
            submissionRepository.save(submission);
            user.setProblemsSolved(user.getProblemsSolved() + 1);
            
            // Add a notification
            notificationService.createNotification(user, "Problem Solved! 🎉", "You successfully completed: " + problem.getTitle());
        }
    }

    @Transactional(readOnly = true)
    public ProblemDto.TopicDetailsResponse getTopicDetails(User user, Long topicId) {
        var topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new RuntimeException("Topic not found"));

        Set<Long> solvedIds = submissionRepository.findSolvedProblemIdsByUserId(user.getId())
                .stream().collect(Collectors.toSet());
        Set<Long> bookmarkedIds = bookmarkRepository.findBookmarkedProblemIdsByUserId(user.getId())
                .stream().collect(Collectors.toSet());

        List<Subtopic> subtopics = subtopicRepository.findByTopicId(topicId);
        List<Problem> problems = problemRepository.findAllByTopicId(topicId);

        // Group problems by subtopic ID for quick lookup
        Map<Long, List<Problem>> problemsBySubtopic = problems.stream()
                .filter(p -> p.getSubtopic() != null)
                .collect(Collectors.groupingBy(p -> p.getSubtopic().getId()));

        List<ProblemDto.SubtopicResponse> subtopicResponses = subtopics.stream()
                .map(sub -> {
                    List<Problem> subProblems = problemsBySubtopic.getOrDefault(sub.getId(), List.of());
                    List<ProblemDto.ProblemResponse> problemResponses = subProblems.stream()
                            .map(p -> mapToResponse(p, solvedIds, bookmarkedIds))
                            .collect(Collectors.toList());

                    return ProblemDto.SubtopicResponse.builder()
                            .id(sub.getId())
                            .name(sub.getName())
                            .description(sub.getDescription())
                            .problems(problemResponses)
                            .build();
                })
                .collect(Collectors.toList());

        return ProblemDto.TopicDetailsResponse.builder()
                .id(topic.getId())
                .name(topic.getName())
                .icon(topic.getIcon())
                .subtopics(subtopicResponses)
                .build();
    }

    private ProblemDto.ProblemResponse mapToResponse(Problem p, Set<Long> solvedIds, Set<Long> bookmarkedIds) {
        return ProblemDto.ProblemResponse.builder()
                .id(p.getId())
                .title(p.getTitle())
                .slug(p.getSlug())
                .difficulty(p.getDifficulty().name())
                .acceptanceRate(p.getAcceptanceRate())
                .topics(p.getTopics().stream().map(t -> t.getName()).collect(Collectors.toList()))
                .companies(p.getCompanies().stream().map(c -> c.getName()).collect(Collectors.toList()))
                .companyInfo(p.getCompanies().stream()
                        .map(c -> new ProblemDto.CompanyInfo(c.getName(), c.getLogoUrl()))
                        .collect(Collectors.toList()))
                .solved(solvedIds.contains(p.getId()))
                .bookmarked(bookmarkedIds.contains(p.getId()))
                .leetcodeUrl(p.getLeetcodeUrl())
                .gfgUrl(p.getGfgUrl())
                .youtubeUrl(p.getYoutubeUrl())
                .articleUrl(p.getArticleUrl())
                .subtopicId(p.getSubtopic() != null ? p.getSubtopic().getId() : null)
                .subtopicName(p.getSubtopic() != null ? p.getSubtopic().getName() : null)
                .build();
    }
}
