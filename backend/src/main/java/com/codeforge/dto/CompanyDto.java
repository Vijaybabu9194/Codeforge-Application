package com.codeforge.dto;

import lombok.*;
import java.util.List;
import java.util.Map;

public class CompanyDto {

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class CompanyListItem {
        private Long id;
        private String name;
        private String logoUrl;
        private Integer totalQuestions;
        private String hiringTrend;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class CompanyDetailResponse {
        private Long id;
        private String name;
        private String logoUrl;
        private Integer totalQuestions;
        private String hiringTrend;
        private Integer interviewFrequency;
        private Map<String, Integer> difficultyDistribution;
        private List<TopicCount> topTopics;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class TopicCount {
        private String topic;
        private Integer count;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class CompanyQuestionResponse {
        private Long id;
        private String title;
        private String difficulty;
        private Integer timesAsked;
        private String frequency;
        private Double acceptanceRate;
        private Boolean solved;
        private String leetcodeUrl;
        private String gfgUrl;
    }
}
