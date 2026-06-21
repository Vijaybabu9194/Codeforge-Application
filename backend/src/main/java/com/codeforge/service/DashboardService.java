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
    private final PlatformProfileRepository platformProfileRepository;
    private final SubmissionRepository submissionRepository;
    private final ProblemRepository problemRepository;

    public DashboardDto.StatsResponse getStats(User user) {
        long bookmarkCount = bookmarkRepository.findByUserId(user.getId()).size();
        List<PlatformProfile> profiles = platformProfileRepository.findByUserId(user.getId());
        
        int solvedCount = (int) submissionRepository.countSolvedByUserId(user.getId());
        int platformSolved = profiles.stream().mapToInt(PlatformProfile::getProblemsSolved).sum();
        
        int attemptedCount = (int) submissionRepository.countByUserId(user.getId());
        int totalProblems = (int) problemRepository.count();
        
        int contestRating = user.getContestRating();
        if (!profiles.isEmpty()) {
            contestRating = profiles.stream()
                    .mapToInt(PlatformProfile::getContestRating)
                    .max()
                    .orElse(contestRating);
        }

        return DashboardDto.StatsResponse.builder()
                .problemsSolved(solvedCount + platformSolved)
                .contestRating(contestRating)
                .currentStreak(user.getCurrentStreak())
                .companiesCovered(user.getCompaniesCovered())
                .studyHours(user.getStudyHours())
                .bookmarks((int) bookmarkCount)
                .totalProblems(totalProblems)
                .attempted(attemptedCount)
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
        List<PlatformProfile> profiles = platformProfileRepository.findByUserId(user.getId());
        
        // 1. Contest rating trend
        List<DashboardDto.ChartPoint> contestTrend = new ArrayList<>();
        int rating = user.getContestRating();
        if (!profiles.isEmpty()) {
            rating = profiles.stream()
                    .mapToInt(PlatformProfile::getContestRating)
                    .max()
                    .orElse(rating);
        }
        
        String[] months = {"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"};
        int startRating = Math.max(rating - 150, 0);
        int step = (rating - startRating) / 11;
        for (int i = 0; i < 12; i++) {
            int val = (rating == 0) ? 0 : (startRating + i * step);
            if (i == 11) val = rating;
            contestTrend.add(DashboardDto.ChartPoint.builder().label(months[i]).value(val).build());
        }

        // 2. Questions solved trend
        List<DashboardDto.ChartPoint> questionsTrend = new ArrayList<>();
        List<Submission> solvedSubmissions = submissionRepository.findByUserIdAndSolvedTrue(user.getId());
        int platformSolved = profiles.stream().mapToInt(PlatformProfile::getProblemsSolved).sum();
        
        int currentYear = LocalDate.now().getYear();
        int[] monthlyCounts = new int[12];
        for (Submission sub : solvedSubmissions) {
            if (sub.getSubmittedAt() != null && sub.getSubmittedAt().getYear() == currentYear) {
                int monthIdx = sub.getSubmittedAt().getMonthValue() - 1;
                monthlyCounts[monthIdx]++;
            }
        }
        
        int cumulative = platformSolved; // start with platform solved as base
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
