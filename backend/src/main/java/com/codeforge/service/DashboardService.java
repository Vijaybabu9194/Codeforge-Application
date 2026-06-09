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

    public DashboardDto.StatsResponse getStats(User user) {
        long bookmarkCount = bookmarkRepository.findByUserId(user.getId()).size();
        return DashboardDto.StatsResponse.builder()
                .problemsSolved(user.getProblemsSolved())
                .contestRating(user.getContestRating())
                .currentStreak(user.getCurrentStreak())
                .companiesCovered(user.getCompaniesCovered())
                .studyHours(user.getStudyHours())
                .bookmarks((int) bookmarkCount)
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
        // Contest trend (mock monthly data derived from user rating)
        List<DashboardDto.ChartPoint> contestTrend = new ArrayList<>();
        String[] months = {"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"};
        int baseRating = Math.max(user.getContestRating() - 300, 1200);
        Random rand = new Random(user.getId());
        for (String month : months) {
            baseRating += rand.nextInt(60) - 15;
            contestTrend.add(DashboardDto.ChartPoint.builder().label(month).value(baseRating).build());
        }

        // Questions solved trend
        List<DashboardDto.ChartPoint> questionsTrend = new ArrayList<>();
        int cumulative = 0;
        for (String month : months) {
            cumulative += rand.nextInt(30) + 10;
            questionsTrend.add(DashboardDto.ChartPoint.builder().label(month).value(Math.min(cumulative, user.getProblemsSolved())).build());
        }

        // Topic mastery
        List<Topic> topics = topicRepository.findAll();
        List<DashboardDto.TopicProgress> topicMastery = topics.stream()
                .filter(t -> t.getProblemCount() > 0)
                .map(t -> {
                    int solved = rand.nextInt(t.getProblemCount()) + 1;
                    return DashboardDto.TopicProgress.builder()
                            .topic(t.getName())
                            .solved(solved)
                            .total(t.getProblemCount())
                            .percentage(Math.round(100.0 * solved / t.getProblemCount() * 10) / 10.0)
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
