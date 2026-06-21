package com.codeforge.service;

import com.codeforge.dto.ProblemDto;
import com.codeforge.entity.*;
import com.codeforge.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import java.util.ArrayList;
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
    private final ActivityRepository activityRepository;
    private final DailyActivityRepository dailyActivityRepository;
    private final EntityManager entityManager;

    public ProblemDto.ProblemListResponse getProblems(User user, Long topicId, String difficulty,
                                                       String search, Long companyId, String status, int page, int size) {
        StringBuilder queryBuilder = new StringBuilder("SELECT DISTINCT p FROM Problem p");
        StringBuilder countBuilder = new StringBuilder("SELECT COUNT(DISTINCT p) FROM Problem p");

        StringBuilder joins = new StringBuilder();
        if (topicId != null) {
            joins.append(" JOIN p.topics t");
        }
        if (companyId != null) {
            joins.append(" JOIN p.companies c");
        }
        queryBuilder.append(joins);
        countBuilder.append(joins);

        List<String> wheres = new ArrayList<>();
        if (topicId != null) {
            wheres.add("t.id = :topicId");
        }
        if (companyId != null) {
            wheres.add("c.id = :companyId");
        }
        if (difficulty != null && !difficulty.isBlank() && !"all".equalsIgnoreCase(difficulty)) {
            wheres.add("p.difficulty = :difficulty");
        }
        if (search != null && !search.isBlank()) {
            wheres.add("LOWER(p.title) LIKE LOWER(:search)");
        }
        if (status != null && !status.isBlank() && !"all".equalsIgnoreCase(status)) {
            if ("solved".equalsIgnoreCase(status)) {
                wheres.add("p.id IN (SELECT s2.problem.id FROM Submission s2 WHERE s2.user.id = :userId AND s2.solved = true)");
            } else if ("unsolved".equalsIgnoreCase(status)) {
                wheres.add("p.id NOT IN (SELECT s2.problem.id FROM Submission s2 WHERE s2.user.id = :userId AND s2.solved = true)");
            } else if ("bookmarked".equalsIgnoreCase(status)) {
                wheres.add("p.id IN (SELECT b2.problem.id FROM Bookmark b2 WHERE b2.user.id = :userId)");
            }
        }

        if (!wheres.isEmpty()) {
            String whereStr = " WHERE " + String.join(" AND ", wheres);
            queryBuilder.append(whereStr);
            countBuilder.append(whereStr);
        }

        queryBuilder.append(" ORDER BY p.id ASC");

        var query = entityManager.createQuery(queryBuilder.toString(), Problem.class);
        var countQuery = entityManager.createQuery(countBuilder.toString(), Long.class);

        // Set parameters
        if (wheres.stream().anyMatch(w -> w.contains(":userId"))) {
            query.setParameter("userId", user.getId());
            countQuery.setParameter("userId", user.getId());
        }
        if (topicId != null) {
            query.setParameter("topicId", topicId);
            countQuery.setParameter("topicId", topicId);
        }
        if (companyId != null) {
            query.setParameter("companyId", companyId);
            countQuery.setParameter("companyId", companyId);
        }
        if (difficulty != null && !difficulty.isBlank() && !"all".equalsIgnoreCase(difficulty)) {
            Problem.Difficulty diffEnum = Problem.Difficulty.valueOf(difficulty.toUpperCase());
            query.setParameter("difficulty", diffEnum);
            countQuery.setParameter("difficulty", diffEnum);
        }
        if (search != null && !search.isBlank()) {
            String searchPattern = "%" + search.trim().toLowerCase() + "%";
            query.setParameter("search", searchPattern);
            countQuery.setParameter("search", searchPattern);
        }

        // Execute count
        Long totalElements = countQuery.getSingleResult();

        // Paginate select
        query.setFirstResult(page * size);
        query.setMaxResults(size);

        List<Problem> problemsList = query.getResultList();

        Set<Long> solvedIds = submissionRepository.findSolvedProblemIdsByUserId(user.getId())
                .stream().collect(Collectors.toSet());
        Set<Long> bookmarkedIds = bookmarkRepository.findBookmarkedProblemIdsByUserId(user.getId())
                .stream().collect(Collectors.toSet());

        List<ProblemDto.ProblemResponse> problems = problemsList.stream()
                .map(p -> mapToResponse(p, solvedIds, bookmarkedIds))
                .collect(Collectors.toList());

        int totalPages = (int) Math.ceil((double) totalElements / size);

        return ProblemDto.ProblemListResponse.builder()
                .problems(problems)
                .totalPages(totalPages)
                .totalElements(totalElements)
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
            
            // Increment problems solved
            user.setProblemsSolved(user.getProblemsSolved() + 1);
            
            // Save Activity entry
            var activity = Activity.builder()
                    .user(user)
                    .type(Activity.ActivityType.SOLVED)
                    .description("Solved " + problem.getTitle())
                    .detail(problem.getDifficulty().name())
                    .difficulty(problem.getDifficulty().name())
                    .createdAt(java.time.LocalDateTime.now())
                    .build();
            activityRepository.save(activity);

            // Increment/save DailyActivity entry
            java.time.LocalDate today = java.time.LocalDate.now();
            var dailyAct = dailyActivityRepository.findByUserIdAndActivityDate(user.getId(), today)
                    .orElseGet(() -> DailyActivity.builder()
                            .user(user)
                            .activityDate(today)
                            .count(0)
                            .build());
            dailyAct.setCount(dailyAct.getCount() + 1);
            dailyActivityRepository.save(dailyAct);

            // Update streaks
            int computedStreak = calculateCurrentStreak(user.getId());
            user.setCurrentStreak(computedStreak);
            if (computedStreak > user.getMaxStreak()) {
                user.setMaxStreak(computedStreak);
            }
            
            // Add a notification
            notificationService.createNotification(user, "Problem Solved! 🎉", "You successfully completed: " + problem.getTitle());
        }
    }

    private int calculateCurrentStreak(Long userId) {
        java.time.LocalDate today = java.time.LocalDate.now();
        java.time.LocalDate yesterday = today.minusDays(1);
        
        List<java.time.LocalDate> activeDates = dailyActivityRepository.findActiveDatesByUserId(userId);
        
        if (activeDates.isEmpty()) {
            return 0;
        }
        
        java.time.LocalDate mostRecent = activeDates.get(0);
        if (!mostRecent.equals(today) && !mostRecent.equals(yesterday)) {
            return 0;
        }
        
        int streak = 1;
        for (int i = 0; i < activeDates.size() - 1; i++) {
            java.time.LocalDate current = activeDates.get(i);
            java.time.LocalDate next = activeDates.get(i + 1);
            if (current.minusDays(1).equals(next)) {
                streak++;
            } else if (current.equals(next)) {
                // Ignore duplicates
            } else {
                break;
            }
        }
        return streak;
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
