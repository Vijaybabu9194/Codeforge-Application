package com.codeforge.dto;

import lombok.*;
import java.util.List;

public class DashboardDto {

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class StatsResponse {
        private Integer problemsSolved;
        private Integer contestRating;
        private Integer currentStreak;
        private Integer companiesCovered;
        private Double studyHours;
        private Integer bookmarks;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class HeatmapEntry {
        private String date;
        private Integer count;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ProgressResponse {
        private List<ChartPoint> contestTrend;
        private List<ChartPoint> questionsTrend;
        private List<TopicProgress> topicMastery;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ChartPoint {
        private String label;
        private Integer value;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class TopicProgress {
        private String topic;
        private Integer solved;
        private Integer total;
        private Double percentage;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ActivityItem {
        private Long id;
        private String type;
        private String description;
        private String detail;
        private String difficulty;
        private String createdAt;
    }
}
