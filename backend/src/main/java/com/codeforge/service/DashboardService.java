package com.codeforge.service;

import com.codeforge.dto.DashboardDto;
import com.codeforge.entity.*;
import com.codeforge.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final BookmarkRepository bookmarkRepository;
    private final DailyActivityRepository dailyActivityRepository;
    private final ActivityRepository activityRepository;
    private final TopicRepository topicRepository;
    private final SubmissionRepository submissionRepository;
    private final ProblemRepository problemRepository;

    public DashboardDto.StatsResponse getStats(User user) {
        long bookmarkCount = bookmarkRepository.findByUserId(user.getId()).size();
        int solvedCount = (int) submissionRepository.countSolvedByUserId(user.getId());
        
        int attemptedCount = (int) submissionRepository.countByUserId(user.getId());
        int totalProblems = (int) problemRepository.count();
        
        int contestRating = user.getContestRating(); // 0 if no contests participated

        List<Submission> solvedSubmissions = submissionRepository.findByUserIdAndSolvedTrue(user.getId());
        int easySolved = 0;
        int mediumSolved = 0;
        int hardSolved = 0;
        for (Submission sub : solvedSubmissions) {
            if (sub.getProblem() != null && sub.getProblem().getDifficulty() != null) {
                Problem.Difficulty diff = sub.getProblem().getDifficulty();
                if (diff == Problem.Difficulty.EASY) {
                    easySolved++;
                } else if (diff == Problem.Difficulty.MEDIUM) {
                    mediumSolved++;
                } else if (diff == Problem.Difficulty.HARD) {
                    hardSolved++;
                }
            }
        }

        return DashboardDto.StatsResponse.builder()
                .problemsSolved(solvedCount)
                .contestRating(contestRating)
                .currentStreak(user.getCurrentStreak())
                .companiesCovered(user.getCompaniesCovered())
                .studyHours(user.getStudyHours())
                .bookmarks((int) bookmarkCount)
                .totalProblems(totalProblems)
                .attempted(attemptedCount)
                .easySolved(easySolved)
                .mediumSolved(mediumSolved)
                .hardSolved(hardSolved)
                .build();
    }

    public List<DashboardDto.HeatmapEntry> getHeatmap(User user) {
        LocalDate end = LocalDate.now();
        LocalDate start = end.minusDays(365);
        List<DailyActivity> activities = dailyActivityRepository.findByUserIdAndDateRange(user.getId(), start, end);

        DateTimeFormatter fmt = DateTimeFormatter.ISO_LOCAL_DATE;
        return activities.stream()
                .map(da -> DashboardDto.HeatmapEntry.builder()
                        .date(da.getActivityDate().format(fmt))
                        .count(da.getCount())
                        .build())
                .collect(Collectors.toList());
    }

    public DashboardDto.ProgressResponse getProgress(User user) {
        // 1. Contest rating trend
        List<DashboardDto.ChartPoint> contestTrend = new ArrayList<>();
        int rating = user.getContestRating(); // actual rating, 0 if no contests

        String[] months = {"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"};
        for (int i = 0; i < 12; i++) {
            contestTrend.add(DashboardDto.ChartPoint.builder().label(months[i]).value(rating).build());
        }

        // 2. Questions solved trend
        List<DashboardDto.ChartPoint> questionsTrend = new ArrayList<>();
        List<Submission> solvedSubmissions = submissionRepository.findByUserIdAndSolvedTrue(user.getId());

        int currentYear = LocalDate.now().getYear();
        int[] monthlyCounts = new int[12];
        for (Submission sub : solvedSubmissions) {
            if (sub.getSubmittedAt() != null && sub.getSubmittedAt().getYear() == currentYear) {
                int monthIdx = sub.getSubmittedAt().getMonthValue() - 1;
                monthlyCounts[monthIdx]++;
            }
        }
        
        int cumulative = 0; // start with 0 base
        for (Submission sub : solvedSubmissions) {
            if (sub.getSubmittedAt() != null && sub.getSubmittedAt().getYear() < currentYear) {
                cumulative++;
            }
        }
        
        for (int i = 0; i < 12; i++) {
            cumulative += monthlyCounts[i];
            questionsTrend.add(DashboardDto.ChartPoint.builder().label(months[i]).value(cumulative).build());
        }

        // 3. Topic mastery
        List<Topic> topics = topicRepository.findAll();
        List<Object[]> rawCounts = submissionRepository.countSolvedProblemsPerTopic(user.getId());
        Map<Long, Long> topicSolvedMap = new HashMap<>();
        for (Object[] row : rawCounts) {
            topicSolvedMap.put((Long) row[0], (Long) row[1]);
        }

        List<DashboardDto.TopicProgress> topicMastery = topics.stream()
                .filter(t -> t.getProblemCount() > 0)
                .map(t -> {
                    long solved = topicSolvedMap.getOrDefault(t.getId(), 0L);
                    double percentage = Math.round(100.0 * solved / t.getProblemCount() * 10) / 10.0;
                    return DashboardDto.TopicProgress.builder()
                            .topic(t.getName())
                            .solved((int) solved)
                            .total(t.getProblemCount())
                            .percentage(percentage)
                            .build();
                })
                .sorted((a, b) -> Double.compare(b.getPercentage(), a.getPercentage()))
                .limit(10)
                .collect(Collectors.toList());

        return DashboardDto.ProgressResponse.builder()
                .contestTrend(contestTrend)
                .questionsTrend(questionsTrend)
                .topicMastery(topicMastery)
                .build();
    }

    public List<DashboardDto.ActivityItem> getRecentActivity(User user) {
        List<Activity> activities = activityRepository.findByUserIdOrderByCreatedAtDesc(user.getId(), PageRequest.of(0, 15));
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
        return activities.stream()
                .map(a -> DashboardDto.ActivityItem.builder()
                        .id(a.getId())
                        .type(a.getType().name())
                        .description(a.getDescription())
                        .detail(a.getDetail())
                        .difficulty(a.getDifficulty())
                        .createdAt(a.getCreatedAt().format(fmt))
                        .build())
                .collect(Collectors.toList());
    }
}
